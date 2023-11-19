import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View, Text } from "react-native";
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
    props.onRecordingComplete(uri, recordingDuration); // Pass the recording URI and duration back
    setRecording(null);
    setRecordingDuration(0); // Reset duration
  };

  // Format the duration as mm:ss
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
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
      {recordingDuration > 0 && !isRecording && (
        <Pressable onPress={() => props.onRecordingComplete(null, 0)}>
          <Text>
            Duration: {formatDuration(recordingDuration)} (tap to delete)
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

export default RecordVoiceButton;
