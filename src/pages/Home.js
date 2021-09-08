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
  useIonViewWillEnter,
} from "@ionic/react";
import "./Home.css";
import firebase from "../firebase";
import { useState } from "react";

const Home = ({ history }) => {
  const [data, setData] = useState([]);

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

        {/*モーダル*/}
      </IonContent>
    </IonPage>
  );
};

export default Home;
