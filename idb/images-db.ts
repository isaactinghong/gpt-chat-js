// idb
import * as idb from "idb";

export interface IndexedDBImage {
  id?: IDBValidKey;
  conversationId: string;
  date: Date;
  uri: string;
}

export const getImage = async (id: IDBValidKey): Promise<IndexedDBImage> => {
  // open database
  const db = await idb.openDB("chat-images", 1);

  // get the image from IndexedDB
  const image = await db.get("images", id);

  // close database
  await db.close();

  // return the image
  return image;
};

// use IndexedDB to store the compressed image
export const storeImage = async (
  base64Image: string,
  conversationId: string
) => {
  // open database
  const db = await idb.openDB("chat-images", 2, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore("images", {
        // The 'id' property of the object will be the key.
        keyPath: "id",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // Create an index on the 'conversationId' property of the objects.
      store.createIndex("conversationId", "conversationId");
    },
  });

  const imageToStore: IndexedDBImage = {
    conversationId,
    date: new Date(),
    uri: base64Image,
  };

  // add the image to IndexedDB
  const id = await db.add("images", imageToStore);

  // close database
  await db.close();

  // return the id
  return id;
};

// use IndexedDB to delete the compressed image
export const deleteImage = async (id: IDBValidKey) => {
  // open database
  const db = await idb.openDB("chat-images", 1);

  // delete the image from IndexedDB
  await db.delete("images", id);

  // close database
  await db.close();
};

// use IndexedDB to get all images for a conversation
export const getConversationImages = async (conversationId: string) => {
  // open database
  const db = await idb.openDB("chat-images", 1);

  // get the images from IndexedDB
  const images = await db.getAllFromIndex(
    "images",
    "conversationId",
    conversationId
  );

  // close database
  await db.close();

  // return the images
  return images;
};

// use IndexedDB to delete all images for a conversation
export const deleteConversationImages = async (conversationId: string) => {
  // open database
  const db = await idb.openDB("chat-images", 1);

  // get the images from IndexedDB first
  const images = await db.getAllFromIndex(
    "images",
    "conversationId",
    conversationId
  );

  // delete the images from IndexedDB
  await Promise.all(images.map((image) => db.delete("images", image.id)));

  // close database
  await db.close();
};
