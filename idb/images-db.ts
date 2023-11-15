// idb
import * as idb from "idb";

export interface IndexedDBImage {
  id?: IDBValidKey;
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
export const storeImage = async (base64Image: string) => {
  // open database
  const db = await idb.openDB("chat-images", 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore("images", {
        // The 'id' property of the object will be the key.
        keyPath: "id",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // Create an index on the 'date' property of the objects.
      store.createIndex("date", "date");
    },
  });

  const imageToStore: IndexedDBImage = {
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
