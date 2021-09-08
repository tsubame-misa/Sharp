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
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import "./Home.css";
import firebase from "../firebase";
import { useState } from "react";

const Home = ({ history }) => {
  const [name, setName] = useState();
  const [text, setText] = useState();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2012-12-15T13:47:20.789");

  useIonViewWillEnter(() => {
    //sampleデータの取得
    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection("/users")
        .doc("zQDXYTHzUTZIkrWiAgt4")
        .get()
        .then((request) => {
          setData(request.data().data);
        });
    });
  });

  const getDate = () => {
    const date = new Date();
    return date;
  };

  function logout() {
    firebase.auth().signOut();
  }

  const add = () => {
    // sampleデータの追加
    /*
    firebase.auth().onAuthStateChanged((user) => {
      const db = firebase.firestore();
      db.collection("/users")
        .doc("zQDXYTHzUTZIkrWiAgt4")
        .set({
          data: [
            {
              name: "misato",
              created: getDate(),
              id: 1,
              photo: "",
              memo: "#sample#hogehoge#tsubame",
            },
            {
              name: "kei",
              created: getDate() + 10000,
              id: 2,
              photo: "",
              memo: "#sample#numakei",
            },
            {
              name: "saaya",
              created: getDate() + 30000,
              id: 3,
              photo: "",
              memo: "#sample#sashimi",
            },
            {
              name: "ayano",
              created: getDate() + 50000,
              id: 4,
              photo: "",
              memo: "#sample#ruuu",
            },
          ],
        })
        .then(() => {
          console.log("Document successfully written!");
          return 1;
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          return 0;
        });
    });*/
  };

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
        {/*<IonButton
          onClick={() => {
            add();
          }}
        >
          add
        </IonButton>*/}

        {/*リストの表示*/}
        {data.map((item) => {
          let year = item.birthday.slice(0, 4);
          let month = item.birthday.slice(5, 7);
          let day = item.birthday.slice(8, 10);

          return (
            <div>
              <IonCard>
                <IonCardHeader>
                  <div className="avatar">
                    <IonAvatar>
                      <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
                    </IonAvatar>
                  </div>
                  <IonCardTitle className="title">{item.name}</IonCardTitle>
                  <IonCardSubtitle className="sub-title">
                    {year + "年" + month + "月" + day + "日"}
                  </IonCardSubtitle>
                </IonCardHeader>
                　　　　　　
                <IonCardContent>
                  <IonItem className="memo" color="light" lines="none">
                    {item.memo}
                  </IonItem>
                </IonCardContent>
              </IonCard>
            </div>
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
              <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
            </IonAvatar>
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
          <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
