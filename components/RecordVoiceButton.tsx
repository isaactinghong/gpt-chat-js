import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";

const RecordVoiceButton: React.FC<{
  onRecordingComplete: (uri: string, duration: number) => void;
  recordContainerStyle: React.ComponentProps<typeof View>["style"];
}> = (props) => {
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // Start recording
  const startRecording = async () => {
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
    const uri = recording.getURI();

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
      setRecordingDuration(0);
      // log deleted recording
      console.log("deleted recording");
    }
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
      {recording && (
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
      )}
      <Pressable onPress={isRecording ? stopRecording : startRecording}>
        {isRecording ? (
          <Ionicons name="stop" size={24} color="black" />
        ) : (
          <Ionicons name="mic" size={24} color="black" />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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
