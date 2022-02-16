import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  TaskEvent,
} from "firebase/storage";
import { useState } from "react";
import { auth, storage } from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = async (e) => {
    const file: any = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];
    const storageRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    const task = uploadBytesResumable(storageRef, file);

    task.on("state_changed", (snapshot) => {
      const pct = Number(
        ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
      );
      setProgress(pct);
    });

    task.then((snapshot) => {
      getDownloadURL(storageRef)
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Image
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
