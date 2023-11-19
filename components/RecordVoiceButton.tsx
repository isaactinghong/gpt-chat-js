import React, { useState, useEffect } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { AVPlaybackStatus, AVPlaybackStatusSuccess, Audio } from "expo-av";
import OpenAI from "../services/OpenAIService";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";

const RecordVoiceButton: React.FC<{
  onRecordingComplete: (uri: string, duration: number) => void;
  recordContainerStyle: React.ComponentProps<typeof View>["style"];
}> = (props) => {
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [soundObject, setSoundObject] = useState<Audio.Sound | undefined>();

  // Start recording
  const startRecording = async () => {
    console.log("start recording");
    try {
      // clear recording and duration
      setRecording(null);
      setRecordingDuration(0);

      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);

        // Start the duration interval
        const id = setInterval(() => {
          setRecordingDuration((prevDuration) => prevDuration + 1);
        }, 1000);
        setIntervalId(id);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    clearInterval(intervalId);
    setIntervalId(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setRecordingUri(uri);

    // log uri
    console.log("recorded uri:", uri);

    props.onRecordingComplete(uri, recordingDuration); // Pass the recording URI and duration back
    // setRecording(null);
    // setRecordingDuration(0); // Reset duration
  };

  // Format the duration as mm:ss
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  // delete recording, or stop recording if recording is in progress
  const deleteRecording = () => {
    if (isRecording) {
      stopRecording();
      // log stoppped recording
      console.log("stopped recording");
    } else {
      setRecording(null);
      setRecordingUri("");
      setRecordingDuration(0);
      // log deleted recording
      console.log("deleted recording");
    }
  };

  // commitRecording
  // send the recording to the OpenAI Whisper API to get back the transcript
  // and then delete the recording and set the recording duration to 0
  const commitRecording = async () => {
    // send the recording to the OpenAI Whisper API to get back the transcript
    // and then delete the recording and set the recording duration to 0
    console.log("commit recording");

    // stop the recording if it is in progress
    if (isRecording) {
      stopRecording();
    }

    // send the recording to the OpenAI Whisper API to get back the transcript
    /* e.g.
    audio_file= open("/path/to/file/audio.mp3", "rb")
    transcript = client.audio.transcriptions.create(
      model="whisper-1",
      file=audio_file
    )
    */

    // read from URI to blob to FileLike
    console.log("recordingUri:", recordingUri);

    // recorded uri: blob:http://localhost:19006/fb13e32d-9cb9-4e07-963d-4425695d43e6

    const response = await fetch(recordingUri);

    // log response
    console.log("response:", response);

    // convert response to blob
    const recordingBlob = await response.blob();
    // console.log("recordingBlob:", recordingBlob);

    // convert blob to File
    const recordingFile = new File([recordingBlob], "recording.mp3", {
      type: "audio/mp3",
    });

    const downloadResumable = FileSystem.createDownloadResumable(
      recordingUri,
      FileSystem.documentDirectory + "recording.mp3",
      {}
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log("Finished downloading to ", uri);
    } catch (e) {
      console.error(e);
    }

    const whisperResult = await OpenAI.api.audio.transcriptions.create({
      model: "whisper-1",
      file: recordingFile,
    });

    console.log("whisperResult:", whisperResult);

    // delete recording uri
    setRecordingUri("");
  };

  const playRecording = async () => {
    // log entry
    console.log("play recording");

    if (!recordingUri) return;
    const soundObject = new Audio.Sound();
    setSoundObject(soundObject);

    try {
      // log recording uri
      console.log("recordingUri:", recordingUri);
      await soundObject.loadAsync({ uri: recordingUri });
      await soundObject.playAsync();
      // Your sound is playing!

      // log playing
      console.log("playing");

      // set isPlaying to true
      setIsPlaying(true);

      // unload soundObject when finished playing
      soundObject.setOnPlaybackStatusUpdate(
        (playbackStatus: AVPlaybackStatus) => {
          if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
            soundObject.unloadAsync();
            // log unloaded
            console.log("unloaded");

            // set isPlaying to false
            setIsPlaying(false);
          }
        }
      );
    } catch (error) {
      // An error occurred!
      console.log("error:", error);
    }
  };

  const stopPlayingRecording = async () => {
    // log entry
    console.log("stop playing recording");

    if (!soundObject) return;
    await soundObject.stopAsync();
    // log stopped
    console.log("stopped");

    // set isPlaying to false
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <View style={props.recordContainerStyle ?? styles.recordVoiceButton}>
      {(isRecording || recordingUri != "") && (
        <View>
          <Pressable onPress={deleteRecording}>
            <Text
              style={
                isRecording
                  ? styles.durationRecording
                  : styles.durationNotRecording
              }
            >
              {formatDuration(recordingDuration)}
            </Text>
          </Pressable>
        </View>
      )}
      {/* a tick icon to commit the recording */}
      {(isRecording || recordingUri != "") && (
        <Pressable onPress={commitRecording} style={styles.actionButton}>
          <Ionicons name="checkmark" size={24} color="black" />
        </Pressable>
      )}
      {/* a trash icon to delete the recording */}
      {(isRecording || recordingUri != "") && (
        <Pressable onPress={deleteRecording} style={styles.actionButton}>
          <Ionicons name="trash" size={24} color="black" />
        </Pressable>
      )}
      {/* if recording is not present, a mic icon to start the recording, or a stop icon to stop the recording */}
      {recordingUri == "" && (
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={styles.actionButton}
        >
          {isRecording ? (
            <Ionicons name="stop" size={24} color="black" />
          ) : (
            <Ionicons name="mic" size={24} color="black" />
          )}
        </Pressable>
      )}
      {/* if recording is present, a play icon to play the recording, or a stop icon to stop the recording */}
      {recordingUri != "" && (
        <Pressable
          onPress={isPlaying ? stopPlayingRecording : playRecording}
          style={styles.actionButton}
        >
          {isPlaying ? (
            <Ionicons name="stop" size={24} color="black" />
          ) : (
            <Ionicons name="play" size={24} color="black" />
          )}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    marginRight: 3,
    marginLeft: 6,
  },
  recordVoiceButton: {
    position: "absolute",
    right: 78,
    bottom: 23,
    flexDirection: "row",
    alignItems: "center",
  },
  durationRecording: {
    // dark red
    color: "red",
    fontSize: 16,
    marginRight: 10,
  },
  durationNotRecording: {
    // black
    color: "black",
    fontSize: 16,
    marginRight: 10,
  },
});

export default RecordVoiceButton;
