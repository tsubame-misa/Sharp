import { useState } from "react";
import { IonIcon } from "@ionic/react";
import "./InputHashtag.css";
import { closeOutline } from "ionicons/icons";

const InputHashtag = ({ tags, setTags }) => {
  //const [tags, setTags] = useState([]);
  const [hashtag, setHashTag] = useState("#大学");
  const [focused, setFocused] = useState(false);

  function addHashTag() {
    if (hashtag === "" || hashtag === "#" || !focused) {
      return;
    }

    const newPrograms = Array.from(tags);
    newPrograms.push({
      name: hashtag,
      id: new Date().getTime().toString(),
    });
    setTags(newPrograms);
    setFocused(false);
    setHashTag("#大学");
  }

  function deleteTag(id) {
    const newTags = [...tags].filter((item) => item.id !== id);
    setTags(newTags);
  }

  return (
    <div className="hashtag-area">
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
            className="textlines"
            value={hashtag}
            onChange={(e) => {
              setFocused(true);
              if (e.target.value[0] === "#") {
                setHashTag(e.target.value);
              } else {
                setHashTag("#" + e.target.value);
              }
            }}
            /*onBlur={() => {
              addHashTag();
            }}*/
            onFocus={() => setHashTag("#")}
          />
          <div className="ok-button">
            <button
              onClick={() => {
                console.log("onClick");
                addHashTag();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputHashtag;
