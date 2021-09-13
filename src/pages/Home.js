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
  IonItemDivider,
  IonLoading,
} from "@ionic/react";
import {
  addOutline,
  cameraOutline,
  ellipsisHorizontal,
  menuOutline,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";
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
import InputHashtag from "../components/InputHashtag";

function getVisited() {
  const v = localStorage.getItem("visited");
  return !!parseInt(v, 10);
}

const Home = ({ history }) => {
  const [allStorageData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  function setData_(v) {
    /*console.log("setData_");
    console.trace();*/
    setData(v);
  }
  const [img, setImg] = useState("");
  const [imgName, setImgName] = useState("");
  const [preImgName, setPreImgName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [name, setName] = useState(null);
  const [text, setText] = useState(null);
  const [ID, setID] = useState(null);
  const [popoverState1, setshowPopover1] = useState({
    showPopover1: false,
    event: undefined,
  });
  const [popoverState2, setshowPopover2] = useState({
    showPopover2: false,
    event: undefined,
  });
  const [userId, setUserId] = useState(null);
  const [firstLogined, setFirstLogined] = useState(getVisited());
  const [showAlert, setShowAlert] = useState(false);
  const [showFileSizeAlert, setShowFileSizeAlert] = useState(false);
  const [search, setSearch] = useState(false);
  const [birthdayMember, setBirthdayMembser] = useState([]);
  const [showBirthdayList, setShowBirthdayList] = useState(true);
  const [birthdayHeaderList, setBirthdayHeaderList] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [tags, setTags] = useState([]);

  //console.log(JSON.parse(JSON.stringify(tags)));

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
          const data = responce.data;
          const sortedData = [...data].sort((a, b) => {
            return b.created - a.created;
          });

          setAllData(sortedData);
          setData_(sortedData);
          whoIsBirthdayMember(sortedData);
        });
    });
  });

  useEffect(() => {
    window.addEventListener("storage", () => {
      setFirstLogined(getVisited());
    });
  }, []);

  function whoIsBirthdayMember(data) {
    const todayAll = getDate();
    const today = new Date();
    today.setFullYear(todayAll.getFullYear());
    today.setMonth(today.getMonth());
    today.setDate(today.getDate());

    const menber = [];
    const header = [];

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
        //1msの誤差がバグらせてる可能性あり。誤差の原因不明。msの制御？
        if (Math.abs(diff) <= 86400000 * 3 + 1) {
          item.birthdayForCalc = birthday2;
          menber.push(item);

          //TODOリファクタリング
          if (header.length === 0) {
            header.push(birthday2);
          }

          let same = false;
          for (const h of header) {
            if (
              h.getMonth() === birthday2.getMonth() &&
              h.getDate() === birthday2.getDate()
            ) {
              same = true;
            }
          }
          if (!same) {
            header.push(birthday2);
          }
        }
      }
    }

    const sortedHeader = [...header].sort((a, b) => {
      return a - b;
    });

    const sortedData = [...menber].sort((a, b) => {
      return new Date(a.birthday) - new Date(b.birthday);
    });

    setBirthdayMembser(sortedData);
    setBirthdayHeaderList(sortedHeader);
  }

  const getDate = () => {
    const date = new Date();
    return date;
  };

  function logout() {
    firebase.auth().signOut();
  }

  async function uploadImg(first) {
    if (img === "") {
      return "";
    }

    try {
      //画像変更なしの場合
      // console.log(imgName, preImgName);
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
        first || imgName !== preImgName ? imgName : preImgName,
        blob
      );

      setImg(newImageUri);
      return newImageUri;
    } catch (error) {
      console.error(error);
    }
  }

  function addPicture(e) {
    if (e.target.files[0] === undefined) {
      return;
    }

    if (e.target.files[0]?.size > 3000000) {
      setShowFileSizeAlert(true);
      return;
    }
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
      // memo: text,
      tags: tags,
      created: getDate(),
      id: new Date().getTime().toString(),
      icon_path: await uploadImg(true),
      icon_name: imgName,
    };

    const allData = data.concat(newData);
    await setData2DB(allData, userId);
    clearState();
  }

  async function updateData() {
    const path = await uploadImg(false);
    const newData = {
      name: name,
      birthday: selectedDate,
      // memo: text,
      tags: tags,
      created: getDate(),
      id: ID === null ? new Date().getTime().toString() : ID,
      icon_path: path !== undefined ? path : "",
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

  console.log(selectedDate);
  function clearState() {
    console.log("clearState");
    setName(null);
    setImg("");
    setImgName("");
    setPreImgName("");
    setText(null);
    setSelectedDate(null);
    setID(null);
    setTags([]);
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
    if (item.tags?.length !== undefined) {
      setTags(item.tags);
    }
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

  function date2String(d) {
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const date = `${d.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${date}`;
  }

  function getBirthdayListDate(date) {
    if (date == null) {
      return "";
    }

    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    return month + "月" + day + "日";
  }

  function sameDate(header, birthday) {
    const headerDate = date2String(header).slice(5, 10);
    const birthdayDate = birthday.slice(5, 10);
    return headerDate === birthdayDate;
  }

  async function deleteProfile() {
    const deletedData = allStorageData.filter((item) => item.id !== ID);
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

  async function canselSearch() {
    setSearch(!search);
    setData_(allStorageData);
  }

  async function searchProfile(word, profiles) {
    if (word === "" || word === undefined) {
      setSearch(!search);
      setData_(profiles);
      return;
    }

    const newData = profiles.filter((item) =>
      findWord(item.memo + " " + item.name, word)
    );

    if (newData.length > 0) {
      setData_(newData);
      return;
    }
    setData_([]);
  }

  if (!firstLogined) {
    return <Guide modal={true} />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="Header">
          <IonTitle className="ionTitle">#Sharp</IonTitle>
          <IonButton
            className="mainSet-button"
            color="test"
            fill="none"
            slot="end"
            onClick={(e) => {
              e.persist();
              setshowPopover2({ showPopover2: true, event: e });
            }}
          >
            <IonIcon slot="icon-only" size="large" icon={menuOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/*リストの表示*/}
        {/*<IonSearchbar
          className="search"
          value={searchText}
          showCancelButton="focus"
          placeholder="検索"
          cancelButtonText="キャンセル"
          onIonCancel={() => canselSearch()}
          onIonChange={(e) => {
            setSearchText(e.target.value);
            setSearch(!search);
            searchProfile(e.detail.value, allStorageData);
          }}
        ></IonSearchbar>*/}

        {birthdayMember.length !== 0 && searchText === "" && (
          <div>
            <IonList>
              <IonItemDivider color="medium">
                誕生日
                <IonButton
                  fill="clear"
                  color="dark"
                  onClick={() => setShowBirthdayList(!showBirthdayList)}
                >
                  {showBirthdayList ? "閉じる" : "見る"}
                  {/**IconでStateを表示した方がいい？*/}
                  {/*<IonIcon
                    icon={showBirthdayList ? eyeOffOutline : eyeOutline}
                  />*/}
                </IonButton>
              </IonItemDivider>
              {showBirthdayList &&
                birthdayHeaderList.map((header, id) => {
                  return (
                    <div key={id}>
                      {/*TODO:ダブった時にヘッダーが一つになるように */}
                      <IonItemDivider color="light">
                        {getBirthdayListDate(date2String(header))}
                      </IonItemDivider>
                      {birthdayMember.map((item) => {
                        if (sameDate(header, item.birthday)) {
                          return (
                            <div key={item.id}>
                              <IonItem lines="full">
                                <IonAvatar slot="start">
                                  <img
                                    src={
                                      item.icon_path !== ""
                                        ? item.icon_path
                                        : avatar_first
                                    }
                                    alt="icon birthday"
                                  />
                                </IonAvatar>
                                {item.name}
                              </IonItem>
                            </div>
                          );
                        } else {
                          return <div key={item.id}></div>;
                        }
                      })}
                    </div>
                  );
                })}
            </IonList>
            <IonItemDivider color="medium" style={{ marginTop: "40px" }}>
              メンバー
            </IonItemDivider>
          </div>
        )}

        {data.length !== 0 ? (
          data.map((item) => {
            //console.log(item);
            return (
              <IonCard className="card" key={item.id}>
                <IonCardHeader className="cardHeader">
                  <div className="person">
                    <div className="avatar">
                      <IonAvatar className="avatar-ionic">
                        <img
                          src={
                            item.icon_path !== ""
                              ? item.icon_path
                              : avatar_first
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
                    //color="white"
                    fill="clear"
                    color="dark"
                    onClick={(e) => {
                      e.persist();
                      setID(item.id);
                      setshowPopover1({
                        showPopover1: true,
                        event: e,
                        item: item,
                      });
                    }}
                  >
                    <IonIcon
                      slot="icon-only"
                      size="default"
                      icon={ellipsisHorizontal}
                    ></IonIcon>
                  </IonButton>
                </IonCardHeader>
                　　
                {/*item.memo !== "" &&
                    item.memo !== undefined &&
                    item.memo !== null && (
                      <div className="memo">{item.memo}</div>
                    )*/}
                {item.tags?.length !== 0 && (
                  <IonCardContent className="cardContent">
                    <div className="hashtags">
                      {item.tags?.map((tag) => {
                        return (
                          <div key={tag.id} className="tag-wrapper">
                            <a
                              className="tag-link"
                              href={`/search?q=${tag.name.split("#")[1]}`}
                            >
                              {tag.name}
                            </a>
                            &ensp;
                          </div>
                        );
                      })}
                    </div>
                  </IonCardContent>
                )}{" "}
              </IonCard>
            );
          })
        ) : (
          <div className="empty">
            {searchText === "" ? (
              <div>
                右下のボタンからプロフィールを
                <br />
                追加しましょう
              </div>
            ) : (
              <div>一致する検索結果はありません</div>
            )}
          </div>
        )}

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
                  onClick={() => {
                    setshowPopover1({ showPopover1: false });
                    setShowModal(false);
                    requestAnimationFrame(() => clearState());
                  }}
                >
                  戻る
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton
                  onClick={async () => {
                    setShowModal(false);
                    setshowPopover1({ showPopover1: false });
                    await (popoverState1.showPopover1
                      ? updateData()
                      : saveData());
                    //setShowLoading(true);
                    const data = await getAllData(userId);
                    const sortedData = [...data].sort((a, b) => {
                      return b.created - a.created;
                    });
                    setData_(sortedData);
                    setAllData(sortedData);
                    whoIsBirthdayMember(sortedData);
                    //setShowLoading(false);
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
            <IonAvatar slot="start" className="modal-avatar">
              <img src={img !== "" ? img : avatar_first} alt="icon" />
              <label htmlFor="filename" className="cameraIcon">
                <IonIcon icon={cameraOutline} size="20px" color="favorite" />
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
              doneText="OK"
              cancelText="キャンセル"
              value={selectedDate ?? "2000-01-01"}
              className={selectedDate ? "date-changed" : "date-empty"}
              onIonChange={(e) => {
                console.log("show modal", showModal);
                if (showModal) {
                  setSelectedDate(e.detail.value);
                }
              }}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked" style={{ fontSize: "1.1rem" }}>
              タグ
            </IonLabel>
            <InputHashtag tags={tags} setTags={setTags} />
          </IonItem>
        </IonModal>
        <IonAlert
          isOpen={showFileSizeAlert}
          onDidDismiss={() => setShowFileSizeAlert(false)}
          cssClass="my-custom-class"
          header={""}
          message={"ファイルのサイズは3MB以下にしてください"}
          buttons={["OK"]}
        />
        <IonLoading
          cssClass="my-custom-class"
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Please wait..."}
        />
      </IonContent>
      <IonPopover
        cssClass="my-custom-class"
        event={popoverState1.event}
        isOpen={popoverState1.showPopover1}
        onDidDismiss={() =>
          setshowPopover1({ showPopover1: false, event: undefined })
        }
      >
        <IonList>
          <IonItem
            lines="full"
            onClick={() => {
              addModalData(popoverState1.item);
              setShowModal(true);
            }}
          >
            編集する
          </IonItem>
          <IonItem
            lines="none"
            onClick={async () => {
              setShowAlert(true);
            }}
          >
            削除する
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
                  setshowPopover1({ showPopover1: false, event: undefined });
                },
              },
              {
                text: "削除",
                handler: async () => {
                  await deleteProfile();
                  const data = await getAllData(userId);

                  const profiles = [...data].sort((a, b) => {
                    return b.created - a.created;
                  });
                  setAllData(profiles);
                  whoIsBirthdayMember(profiles);
                  searchProfile(searchText, profiles);
                  setshowPopover1({ showPopover1: false, event: undefined });
                },
              },
            ]}
          />
        </IonList>
      </IonPopover>
      <IonPopover
        cssClass="my-custom-class"
        event={popoverState2.event}
        isOpen={popoverState2.showPopover2}
        onDidDismiss={() =>
          setshowPopover2({ showPopover2: false, event: undefined })
        }
      >
        <IonList>
          <IonItem lines="full" onClick={() => logout()}>
            ログアウト
          </IonItem>
          <IonItem
            lines="none"
            onClick={() => {
              history.push("/setting/Guide");
              setshowPopover2({ showPopover2: false });
            }}
          >
            ガイド
          </IonItem>
        </IonList>
      </IonPopover>
    </IonPage>
  );
};

export default Home;
