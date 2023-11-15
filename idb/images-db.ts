// idb
import * as idb from "idb";

export interface IndexedDBImage {
  id?: IDBValidKey;
  conversationId: string;
  version: number;
  date: Date;
  uri: string;
}

const VERSION = 8;

// openDB returns a promise that resolves to the database
const openDB = () =>
  idb.openDB("chat-images", VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // print the old and new version
      console.log(`upgrade: ${oldVersion} -> ${newVersion}`);

      // apply changes to version 3: delete all old records
      if (oldVersion < VERSION) {
        // delete store if it exists
        if (db.objectStoreNames.contains("images")) {
          db.deleteObjectStore("images");
        }
      }

      // Only create the store if it doesn't exist
      if (!db.objectStoreNames.contains("images")) {
        const store = db.createObjectStore("images", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("conversationId", "conversationId");
      }
    },
  });

export const getImage = async (id: IDBValidKey): Promise<IndexedDBImage> => {
  // open database
  const db = await openDB();

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
  const db = await openDB();

  const imageToStore: IndexedDBImage = {
    conversationId,
    date: new Date(),
    uri: base64Image,
    version: VERSION,
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
  const db = await openDB();

  // delete the image from IndexedDB
  await db.delete("images", id);

  // close database
  await db.close();
};

// use IndexedDB to get all images for a conversation
export const getConversationImages = async (conversationId: string) => {
  // open database
  const db = await openDB();

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
  const db = await openDB();

  // get the images from IndexedDB first
  const images = await db.getAllFromIndex(
    "images",
    "conversationId",
    conversationId
  );

  // log the images
  console.log("deleteConversationImages", images);

  // delete the images from IndexedDB
  await Promise.all(images.map((image) => db.delete("images", image.id)));

  // close database
  await db.close();
};
