import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonAvatar,
  IonItem,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonLabel,
  useIonViewWillEnter,
  IonPopover,
  IonList,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import "./Home.css";
import firebase from "../firebase";
import { useState } from "react";

const Home = ({ history }) => {
  const [data, setData] = useState([]);
  const [img, setImg] = useState(null);
  const [imgName, setImgName] = useState(null);
  const [preImgName, setPreImgName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [name, setName] = useState(null);
  const [text, setText] = useState(null);
  const [ID, setID] = useState(null);
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  useIonViewWillEnter(() => {
    //sampleデータの取得
    getAllData();
  });

  const getAllData = () => {
    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection("/users")
        .doc("zQDXYTHzUTZIkrWiAgt4")
        .get()
        .then((request) => {
          setData(request.data().data);
        });
    });
  };

  const getDate = () => {
    const date = new Date();
    return date;
  };

  function logout() {
    firebase.auth().signOut();
  }

  async function addImg() {
    if (img === null) {
      return "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y";
    }
    let newImageUri;
    try {
      //TODO:画像の変更がない場合はパス

      if (preImgName !== null) {
        const desertRef = firebase.storage().ref().child(`image/${preImgName}`);
        // Delete the file
        desertRef
          .delete()
          .then(function () {
            console.log("file deleted successfully");
          })
          .catch(function (error) {
            // Uh-oh, an error occurred!
          });
      }

      const response = await fetch(img);
      const blob = await response.blob();
      await firebase.storage().ref().child(`image/${imgName}`).put(blob);
      var ref = firebase.storage().ref().child(`image/${imgName}`).put(blob);
      newImageUri = await ref.snapshot.ref.getDownloadURL();
      setImg(newImageUri);
      return newImageUri;
    } catch (error) {
      console.log(error);
    }
  }

  function addPicture(e) {
    const reader = new window.FileReader();
    reader.onload = (event) => {
      setImg(event.target.result);
    };
    setImgName(e.target.files[0].name);
    reader.readAsDataURL(e.target.files[0]);
  }

  async function saveData() {
    const newData = {
      name: name,
      birthday: selectedDate,
      memo: text,
      created: getDate(),
      id: new Date().getTime().toString(),
      icon_path: await addImg(),
      icon_name: imgName,
    };

    const allData = data.concat(newData);

    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection("/users")
        .doc("zQDXYTHzUTZIkrWiAgt4")
        .update({ data: allData })
        .then(() => {
          console.log("Document successfully written!");
          deleteSetData();
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    });
  }

  async function updateData() {
    const newData = {
      name: name,
      birthday: selectedDate,
      memo: text,
      created: getDate(),
      id: ID === null ? new Date().getTime().toString() : ID,
      icon_path: await addImg(),
      icon_name: imgName,
    };

    const allData = data.map((item) => {
      if (item.id === newData.id) {
        newData.id = new Date().getTime().toString();
        return newData;
      } else {
        return item;
      }
    });

    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection("/users")
        .doc("zQDXYTHzUTZIkrWiAgt4")
        .update({ data: allData })
        .then(() => {
          console.log("Document successfully written!");
          deleteSetData();
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    });

    getAllData();
  }

  function deleteSetData() {
    setName(null);
    setImg(null);
    setImgName(null);
    setText(null);
    setSelectedDate(null);
    setID(null);
  }

  function addModalData(item) {
    setName(item.name);
    if (item.icon_path !== null && item.icon_path !== "") {
      setImg(item.icon_path);
      setImgName(item.icon_name);
      setPreImgName(item.icon_name);
    } else {
      setImg(
        "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
      );
    }
    setText(item.memo);
    setSelectedDate(item.birthday);
    setID(item.id);
  }

  function getDisplayDate(date) {
    if (date == null) {
      return "";
    }
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    return year + "年" + month + "月" + day + "日";
  }

  function deleteProfile() {
    const deletedData = data.filter((item) => item.id !== ID);

    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection("/users")
        .doc("zQDXYTHzUTZIkrWiAgt4")
        .update({ data: deletedData })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    });

    const desertRef = firebase.storage().ref().child(`image/${preImgName}`);
    // Delete the file
    desertRef
      .delete()
      .then(function () {
        console.log("file deleted successfully");
        deleteSetData();
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
      });

    setShowPopover({ showPopover: false });
    getAllData();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>#Sharp</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="outline" onClick={() => logout()}>
              ログアウト
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/*リストの表示*/}
        {data.map((item) => {
          return (
            <IonCard key={item.id}>
              <IonCardHeader>
                <div className="avatar">
                  <IonAvatar>
                    <img
                      src={
                        item.icon_path !== ""
                          ? item.icon_path
                          : "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
                      }
                      alt="icon"
                    />
                  </IonAvatar>
                </div>
                <IonCardTitle className="title">{item.name}</IonCardTitle>
                <IonCardSubtitle className="sub-title">
                  {getDisplayDate(item.birthday)}
                </IonCardSubtitle>
                <IonButton
                  className="edit-button"
                  onClick={(e) => {
                    e.persist();
                    addModalData(item);
                    setShowPopover({ showPopover: true, event: e });
                  }}
                >
                  edit
                </IonButton>
              </IonCardHeader>
              　　　　　　
              <IonCardContent>
                <IonItem className="memo" color="light" lines="none">
                  {item.memo}
                </IonItem>
              </IonCardContent>
            </IonCard>
          );
        })}

        {/*右下のボタン*/}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" id={"test"}>
          <IonFabButton color="primary" onClick={() => setShowModal(true)}>
            <IonIcon icon={addOutline} size="20px" />
          </IonFabButton>
        </IonFab>

        {/*モーダル*/}
        <IonModal isOpen={showModal} cssClass="my-custom-class">
          <div style={{ display: "flex" }}>
            <IonAvatar slot="start">
              <img src={img} />
            </IonAvatar>
            <label htmlFor="filename">
              　<span>Click</span>
              <input
                type="file"
                size="16"
                id="filename"
                src={img}
                onChange={addPicture}
              />
            </label>

            <IonInput
              value={name}
              placeholder="UserName"
              onIonChange={(e) => setName(e.detail.value)}
            ></IonInput>
          </div>
          <IonItem>
            <IonLabel>生年月日</IonLabel>
            <IonDatetime
              displayFormat="YYYY/MM/DD"
              min="1994-03-14"
              max="2012-12-09"
              value={selectedDate}
              onIonChange={(e) => setSelectedDate(e.detail.value)}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonTextarea
              placeholder="Enter more information here..."
              value={text}
              onIonChange={(e) => setText(e.detail.value)}
            ></IonTextarea>
          </IonItem>
          <IonButton
            onClick={async () => {
              deleteSetData();
              setShowModal(false);
              setShowPopover({ showPopover: false });
            }}
          >
            Close Modal
          </IonButton>
          <IonButton
            onClick={async () => {
              setShowModal(false);
              popoverState.showPopover ? updateData() : saveData();
              getAllData();
              setShowPopover({ showPopover: false });
            }}
            //条件要検討
            disabled={name == null || name === ""}
          >
            Save
          </IonButton>
        </IonModal>
      </IonContent>
      <IonPopover
        cssClass="my-custom-class"
        event={popoverState.event}
        isOpen={popoverState.showPopover}
        onDidDismiss={() =>
          setShowPopover({ showPopover: false, event: undefined })
        }
      >
        <IonList>
          <IonItem onClick={() => setShowModal(true)}>編集</IonItem>
          <IonItem onClick={() => deleteProfile()}>削除</IonItem>
        </IonList>
      </IonPopover>
    </IonPage>
  );
};

export default Home;
