import React, { useState, useEffect } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { AVPlaybackStatus, AVPlaybackStatusSuccess, Audio } from "expo-av";
import OpenAI from "../services/OpenAIService";
import { Ionicons } from "@expo/vector-icons";
import { toFile } from "openai";

const RecordVoiceButton: React.FC<{
  onRecordingComplete?: (uri: string, duration: number) => void;
  onWhisperResult?: (result: string) => void;
  recordContainerStyle?: React.ComponentProps<typeof View>["style"];
}> = (props) => {
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [soundObject, setSoundObject] = useState<Audio.Sound | undefined>();

  // Start recording
  const startRecording = async () => {
    console.log("start recording");
    try {
      // clear recording and duration
      setRecording(undefined);
      setRecordingDuration(0);

      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording
          .createAsync
          // Audio.RecordingOptionsPresets.HIGH_QUALITY
          ();
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
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    setIntervalId(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI() || "";
    setRecordingUri(uri);

    // log uri
    console.log("recorded uri:", uri);

    props?.onRecordingComplete?.(uri, recordingDuration); // Pass the recording URI and duration back
    // setRecording(null);
    // setRecordingDuration(0); // Reset duration

    return uri;
  };

  // Format the duration as mm:ss
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""
      }${seconds}`;
  };

  // delete recording, or stop recording if recording is in progress
  const deleteRecording = () => {
    if (isRecording) {
      stopRecording();
      // log stoppped recording
      console.log("stopped recording");
    } else {
      setRecording(undefined);
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

    let uri = recordingUri;

    // stop the recording if it is in progress
    if (isRecording) {
      uri = (await stopRecording()) || "";
    }

    // read from URI to blob to FileLike
    const recordingFile = await uriToFile(uri);

    const whisperResult = await OpenAI.api.audio.transcriptions.create({
      model: "whisper-1",
      file: recordingFile,
    });

    console.log("whisperResult:", whisperResult);

    // broadcast the whisper result
    props.onWhisperResult?.(whisperResult.text);

    // delete recording uri
    // deleteRecording();
    pressTrashRecording();
  };

  // useEffect on recordingUri
  // if recordingUri is removed, then delete the recording
  useEffect(() => {
    if (recordingUri == "") {
      deleteRecording();
    }
  }, [recordingUri]);

  const uriToFile = async (uri: string) => {
    console.log("uri:", uri);

    // recorded uri: blob:http://localhost:19006/fb13e32d-9cb9-4e07-963d-4425695d43e6

    const response = await fetch(uri);

    const recordingFile = await toFile(response, "recording.webm", {
      type: "audio/webm",
    });

    return recordingFile;
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

  const pressTrashRecording = () => {
    // clear browser blob storage
    window.URL.revokeObjectURL(recordingUri);

    setRecordingUri("");
  };

  const saveRecording = () => {
    // log entry
    console.log("save recording");

    if (!recordingUri) return;

    // Create a blob link to download
    const link = document.createElement("a");

    link.href = recordingUri;
    link.download = `recording-${recordingDuration}.webm`; // or .mp4 or the appropriate extension
    // Append to the body
    document.body.appendChild(link);
    // Force download
    link.click();
    // Clean up and remove the link
    link.parentNode?.removeChild(link);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <View style={props.recordContainerStyle}>
      {(isRecording || recordingUri != "") && (
        <View style={styles.durationDisplayContainer}>
          <Pressable style={styles.actionButton} onPress={pressTrashRecording}>
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
      {/* a save icon to prompt user to save the recording */}
      {/* {recordingUri != "" && (
        <Pressable onPress={saveRecording} style={styles.actionButton}>
          <Ionicons name="save" size={24} color="black" />
        </Pressable>
      )} */}
      {/* a tick icon to commit the recording */}
      {(isRecording || recordingUri != "") && (
        <Pressable onPress={commitRecording} style={styles.actionButton}>
          <Ionicons name="checkmark" size={24} color="black" />
        </Pressable>
      )}
      {/* a trash icon to delete the recording */}
      {/* {(isRecording || recordingUri != "") && (
        <Pressable onPress={pressTrashRecording} style={styles.actionButton}>
          <Ionicons name="trash" size={24} color="black" />
        </Pressable>
      )} */}
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
    marginRight: 10,
    alignItems: "center",
  },
  durationDisplayContainer: {
    flexDirection: "row",
    flexShrink: 1,
    alignContent: "center",
    alignItems: "center",
  },

  // recordVoiceButton: {
  //   position: "absolute",
  //   right: 48,
  //   bottom: 23,
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  durationRecording: {
    flex: 1,
    // dark red
    color: "red",
    fontSize: 14,
    marginRight: 0,
  },
  durationNotRecording: {
    flex: 1,
    // black
    color: "black",
    fontSize: 14,
    marginRight: 0,
  },
});

export default RecordVoiceButton;
