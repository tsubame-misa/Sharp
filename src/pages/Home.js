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
  IonSearchbar,
  useIonViewWillEnter,
  IonPopover,
  IonList,
  IonAlert,
} from "@ionic/react";
import { addOutline, cameraOutline, ellipsisHorizontal } from "ionicons/icons";
import "./Home.css";
import firebase from "../firebase";
import Guide from "./Guide";
import avatar_first from "../images/avatar.png";
import { useEffect, useState } from "react";
import {
  deleteStorageImg,
  getAllData,
  setData2DB,
  updateData2DB,
  uploadImg2Storage,
} from "../services/api";

function getVisited() {
  const v = localStorage.getItem("visited");
  return !!parseInt(v, 10);
}

const Home = ({ history }) => {
  const [allStorageData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [img, setImg] = useState("");
  const [imgName, setImgName] = useState("");
  const [preImgName, setPreImgName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [name, setName] = useState(null);
  const [text, setText] = useState(null);
  const [ID, setID] = useState(null);
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });
  const [userId, setUserId] = useState(null);
  const [firstLogined, setFirstLogined] = useState(getVisited());
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState(false);
  const [birthdayMember, setBirthdayMembser] = useState([]);

  useIonViewWillEnter(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user === null) {
        return;
      }
      setUserId(user.uid);
      const db = firebase.firestore();
      db.collection("/users")
        .doc(user.uid)
        .get()
        .then((request) => {
          return request.data();
        })
        .then((responce) => {
          if (responce === undefined) {
            return;
          }
          setAllData(responce.data);
          setData(responce.data);
          whoIsBirthdayMember(responce.data);
        });
    });
  });

  useEffect(() => {
    window.addEventListener("storage", () => {
      setFirstLogined(getVisited());
    });
  }, []);

  function whoIsBirthdayMember(data) {
    //("birthdayMember 10");
    //console.log(data);
    //new Date().valueOf();
    const todayAll = getDate();
    const today = new Date();
    today.setFullYear(todayAll.getFullYear());
    today.setMonth(today.getMonth());
    today.setDate(today.getDate());

    const menber = [];

    for (const item of data) {
      if (item.birthday === null) {
        continue;
      }
      for (let i = -1; i <= 1; i++) {
        const birthday = new Date(item.birthday);
        const birthday2 = new Date();
        birthday2.setFullYear(todayAll.getFullYear() + i);
        birthday2.setMonth(birthday.getMonth());
        birthday2.setDate(birthday.getDate());
        const diff = birthday2.valueOf() - today.valueOf();
        //TODO:何日範囲がいいか話し合うこと
        if (Math.abs(diff) <= 86400000 * 3) {
          menber.push(item);
        }
      }
    }

    console.log(menber);
    setBirthdayMembser(menber);
  }

  const getDate = () => {
    const date = new Date();
    return date;
  };

  function logout() {
    firebase.auth().signOut();
  }

  async function uploadImg() {
    if (img === "") {
      return "";
    }

    try {
      //画像変更なしの場合
      if (imgName === preImgName) {
        return img;
      }
      //画像変更ありの場合
      if (preImgName !== "") {
        await deleteStorageImg(preImgName);
      }
      const response = await fetch(img);
      const blob = await response.blob();

      const newImageUri = await uploadImg2Storage(
        preImgName === "" ? imgName : preImgName,
        blob
      );

      setImg(newImageUri);
      return newImageUri;
    } catch (error) {
      console.error(error);
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
      icon_path: await uploadImg(),
      icon_name: imgName,
    };

    const allData = data.concat(newData);
    await setData2DB(allData, userId);
    clearState();
  }

  async function updateData() {
    const newData = {
      name: name,
      birthday: selectedDate,
      memo: text,
      created: getDate(),
      id: ID === null ? new Date().getTime().toString() : ID,
      icon_path: await uploadImg(),
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
    await updateData2DB(allData, userId);
    clearState();
  }

  function clearState() {
    setName(null);
    setImg("");
    setImgName("");
    setPreImgName("");
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
      setImg("");
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

  async function deleteProfile() {
    const deletedData = data.filter((item) => item.id !== ID);
    await updateData2DB(deletedData, userId);
    if (preImgName !== "") {
      await deleteStorageImg(preImgName);
    }
    clearState();
  }

  function findWord(item, word) {
    const re = /\s+/g;
    const words = word.split(re);
    let cnt = 0;
    for (const w of words) {
      if (item) {
        const find = item.indexOf(`${w}`);
        if (find !== -1) {
          cnt += 1;
        }
      }
    }
    if (cnt === words.length) {
      return 1;
    }
    return 0;
  }

  async function SearchData(search, word) {
    if (!search || word === "" || word === undefined) {
      setSearch(!search);
      setData(allStorageData);
      return;
    }

    const newData = allStorageData.filter((item) =>
      findWord(item.memo + " " + item.name, word)
    );

    if (newData.length > 0) {
      setData(newData);
      return;
    }
    setData([]);
  }

  if (!firstLogined) {
    return <Guide modal={true} />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="Header">
          <IonTitle className="ionTitle">#Sharp</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="outline" onClick={() => logout()}>
              ログアウト
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/*リストの表示*/}
        <IonSearchbar
          className="search"
          value={searchText}
          showCancelButton="focus"
          placeholder="検索"
          cancelButtonText="キャンセル"
          onIonCancel={() => SearchData(false)}
          /*onIonChange={(e) => {
            setSearch(!search);
            SearchData(true, e.detail.value);
          }}*/
          onIonChange={(e) => {
            setSearchText(e.target.value);
            setSearch(!search);
            SearchData(true, e.detail.value);
          }}
        ></IonSearchbar>

        {data.map((item) => {
          return (
            <IonCard className="card" key={item.id}>
              <IonCardHeader className="cardHeader">
                <div className="person">
                  <div className="avatar">
                    <IonAvatar>
                      <img
                        src={
                          item.icon_path !== "" ? item.icon_path : avatar_first
                        }
                        alt="icon"
                      />
                    </IonAvatar>
                  </div>
                  <div className="titles">
                    <IonCardTitle className="title">{item.name}</IonCardTitle>
                    <IonCardSubtitle className="sub-title">
                      {getDisplayDate(item.birthday)}
                    </IonCardSubtitle>
                  </div>
                </div>

                <IonButton
                  className="edit-button"
                  color="white"
                  onClick={(e) => {
                    e.persist();
                    addModalData(item);
                    setShowPopover({ showPopover: true, event: e });
                  }}
                >
                  <IonIcon
                    slot="icon-only"
                    size="default"
                    icon={ellipsisHorizontal}
                  ></IonIcon>
                </IonButton>
              </IonCardHeader>
              　　
              <IonCardContent className="cardContent">
                <div className="memo">{item.memo}</div>
              </IonCardContent>
            </IonCard>
          );
        })}

        {/*右下のボタン*/}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" id={"test"}>
          <IonFabButton color="dark" onClick={() => setShowModal(true)}>
            <IonIcon icon={addOutline} size="20px" />
          </IonFabButton>
        </IonFab>

        {/*モーダル*/}
        <IonModal isOpen={showModal} cssClass="my-custom-class">
          <IonHeader>
            <IonToolbar className="Header">
              <IonTitle>追加</IonTitle>
              <IonButtons slot="start">
                <IonButton
                  onClick={async () => {
                    clearState();
                    setShowModal(false);
                    setShowPopover({ showPopover: false });
                  }}
                >
                  戻る
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton
                  onClick={async () => {
                    setShowModal(false);
                    await (popoverState.showPopover
                      ? updateData()
                      : saveData());
                    const data = await getAllData(userId);
                    setData(data);
                    setAllData(data);
                    setShowPopover({ showPopover: false });
                  }}
                  //条件要検討
                  disabled={name == null || name === ""}
                >
                  保存
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <div className="camera">
            <IonAvatar slot="start">
              <img src={img !== "" ? img : avatar_first} alt="icon" />
              <label htmlFor="filename" className="cameraIcon">
                <IonIcon icon={cameraOutline} size="20px" />
                <input
                  type="file"
                  size="16"
                  id="filename"
                  src={img}
                  onChange={addPicture}
                />
              </label>
            </IonAvatar>
          </div>
          <IonItem>
            <IonLabel position="floating">名前*</IonLabel>
            <IonInput
              value={name}
              placeholder="名前、あだ名"
              onIonChange={(e) => setName(e.detail.value)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">誕生日</IonLabel>
            <IonDatetime
              displayFormat="YYYY/MM/DD"
              min="1900-01-01"
              max="2020-12-31"
              value={selectedDate}
              onIonChange={(e) => setSelectedDate(e.detail.value)}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">タグ</IonLabel>
            <IonTextarea
              rows={5}
              placeholder="例．＃大学　＃先輩"
              value={text}
              onIonChange={(e) => setText(e.detail.value)}
            ></IonTextarea>
          </IonItem>
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
          <IonItem
            onClick={async () => {
              setShowAlert(true);
            }}
          >
            削除
          </IonItem>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            cssClass="my-custom-class"
            header={"プロフィールの削除"}
            message={"削除しますか?"}
            buttons={[
              {
                text: "キャンセル",
                handler: () => {
                  setShowPopover({ showPopover: false });
                },
              },
              {
                text: "削除",
                handler: async () => {
                  setShowPopover({ showPopover: false });
                  await deleteProfile();
                  const data = await getAllData(userId);
                  setData(data);
                  setAllData(data);
                },
              },
            ]}
          />
        </IonList>
      </IonPopover>
    </IonPage>
  );
};

export default Home;
