// browser-image-compression
import imageCompression from "browser-image-compression";
import Toast from "react-native-toast-message";

export const compressImage = async (uri: string) => {
  // browser-image-compression

  const file = await imageCompression.getFilefromDataUrl(uri, "image");

  const options = {
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    maxIteration: 2,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(
      `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
    ); // smaller than maxSizeMB

    // return the compressed file
    return imageCompression.getDataUrlFromFile(compressedFile);
  } catch (error) {
    // show error toast message
    Toast.show({
      type: "error",
      text1: "Error compressing image",
      text2: error.message,
    });

    console.log(error);
  }

  return uri;
};