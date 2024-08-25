
// {/* modal for my profile */}
// <Modal animationType="slide" transparent={false} visible={modalVisible}>
//   <View style={styles.modalView}>
//     <Text>My Profile</Text>

//     {/* a flex grow input for my profile */}
//     <TextInput
//       style={{ flex: 1, borderColor: "gray", borderWidth: 1, fontSize: 16 }}
//       multiline={true}
//       numberOfLines={4}
//       value={myProfileLocal}
//       onChangeText={(value) => handleMyProfileTextChange(value)}
//     />

//     {/* show parse error if any */}
//     {parseError ? <Text style={{ color: "red" }}>{parseError}</Text> : null}

//     {/* a row of two buttons: Save and Close */}
//     <View style={styles.modalButtonsContainer}>
//       <Pressable
//         style={GlobalStyles.primaryButton}
//         onPress={() => {
//           // validate myProfileLocal
//           try {
//             // log start
//             console.log("myProfileLocal", myProfileLocal);

//             // set modal visibility to false
//             setModalVisible(false);

//             // parse myProfileLocal into JSON
//             const myProfileJson = JSON.parse(myProfileLocal);

//             // save to store
//             dispatch(saveSettings({ myProfileJson: myProfileJson }));

//             // show success toast message
//             Toast.show({
//               type: "success",
//               text1: "My Profile saved",
//             });
//           } catch (error) {
//             // log error
//             console.error("error setting myProfile", error);

//             return;
//           }
//         }}
//       >
//         <Text style={GlobalStyles.primaryButtonText}>Save</Text>
//       </Pressable>
//       <Pressable
//         style={GlobalStyles.primaryClearButton}
//         onPress={() => {
//           // set modal visibility to false
//           setModalVisible(false);
//         }}
//       >
//         <Text style={GlobalStyles.primaryClearButtonText}>Close</Text>
//       </Pressable>
//     </View>
//   </View>
// </Modal>