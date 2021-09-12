import { useState } from "react";
import {
  IonInput,
  IonButton,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonIcon,
} from "@ionic/react";
import "./InputHashtag.css";
import { closeOutline } from "ionicons/icons";
import { deleteStorageImg } from "../services/api";

const InputHashtag = () => {
  const [tags, setTags] = useState([]);
  const [hashtag, setHashTag] = useState("#");

  function addHashTag() {
    if (hashtag !== "#") {
      const newPrograms = Array.from(tags);
      newPrograms.push({
        name: hashtag,
        id: new Date().getTime().toString(),
      });
      setTags(newPrograms);
      setHashTag("#");
    }
  }

  function deleteTag(id) {
    const newTags = [...tags].filter((item) => item.id !== id);
    setTags(newTags);
  }

  return (
    <div>
      <div className="hashtag-group">
        {tags?.map((item) => {
          return (
            <div className="hashtag" key={item.id}>
              <div>{item.name}</div>
              <button onClick={() => deleteTag(item.id)}>
                <IonIcon icon={closeOutline} />
              </button>
            </div>
          );
        })}
      </div>
      <div>
        <input
          value={hashtag}
          onChange={(e) => {
            setHashTag(e.target.value);
          }}
          onBlur={() => {
            addHashTag();
          }}
        />
        <button onClick={() => addHashTag()}>ok</button>
      </div>
    </div>
  );
};

export default InputHashtag;
