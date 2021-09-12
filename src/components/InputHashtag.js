import { useState } from "react";
import { IonIcon } from "@ionic/react";
import "./InputHashtag.css";
import { closeOutline } from "ionicons/icons";

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
              <div>
                <label>{item.name}</label>
              </div>
              <button onClick={() => deleteTag(item.id)}>
                <IonIcon icon={closeOutline} />
              </button>
            </div>
          );
        })}

        <div className="text-input-group">
          <input
            class="textlines"
            value={hashtag}
            onChange={(e) => {
              setHashTag(e.target.value);
            }}
            onBlur={() => {
              addHashTag();
            }}
          />
          <div className="ok-button">
            <button onClick={() => addHashTag()}>ok</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputHashtag;
