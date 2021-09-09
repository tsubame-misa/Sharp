import firebase from "../firebase";

export async function getAllData(userId) {
  if (userId === null) {
    throw new Error("userId should be specified");
  }

  const db = firebase.firestore();
  const request = await db.collection("/users").doc(userId).get();
  const responce = await request.data();
  if (responce === undefined) {
    return [];
  }
  return responce.data;
}

export function updateData2DB(data, userId) {
  if (userId === null) {
    throw new Error("userId should be specified");
  }

  const db = firebase.firestore();
  return new Promise((resolve, reject) => {
    db.collection("users")
      .doc(userId)
      .update({
        data: data,
      })
      .then(() => {
        console.info("Document update successfully written!");
        resolve();
      })
      .catch((error) => {
        console.error("Error update writing document: ", error);
        reject(error);
      });
  });
}

export function setData2DB(data, userId) {
  if (userId === null) {
    throw new Error("userId should be specified");
  }

  const db = firebase.firestore();
  return new Promise((resolve, reject) => {
    db.collection("users")
      .doc(userId)
      .set({
        data: data,
      })
      .then(() => {
        console.log("Document set successfully written!");
        resolve();
      })
      .catch((error) => {
        console.error("Error set writing document: ", error);
        reject(error);
      });
  });
}

export function deleteStorageImg(name) {
  console.trace();
  const desertRef = firebase.storage().ref().child(`image/${name}`);
  // Delete the file
  return new Promise((resolve, reject) => {
    desertRef
      .delete()
      .then(function () {
        console.log("file deleted successfully");
        resolve();
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function uploadImg(name, blob) {
  await firebase.storage().ref().child(`image/${name}`).put(blob);
  var ref = firebase.storage().ref().child(`image/${name}`).put(blob);
  const newImageUri = await ref.snapshot.ref.getDownloadURL();
  return newImageUri;
}
