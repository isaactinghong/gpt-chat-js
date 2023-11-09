import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";

const InputModal = ({
  visible,
  onClose,
  onConfirm,
  closable = false,
  title,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (inputValue: string) => void;
  closable?: boolean;
  title?: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue(""); // Reset input value
    onClose(); // Close modal
  };

  const onForceClose = () => {
    setInputValue(""); // Reset input value
    onClose(); // Close modal
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{title ?? "Enter your input:"}</Text>
          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            onSubmitEditing={handleConfirm}
          />
          {closable && (
            <Button title="Cancel" onPress={onClose} color={"#000"} />
          )}
          <Button title="Confirm" onPress={handleConfirm} color={"#000"} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim the background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
  },
});

export default InputModal;
