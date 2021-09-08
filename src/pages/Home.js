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
					return (
						<div>
							<IonCard>
								<IonCardHeader>
									<IonCardTitle className="title">{item.name}</IonCardTitle>
									<IonCardSubtitle className="sub-title">
										{item.birthday}
									</IonCardSubtitle>
								</IonCardHeader>
								<IonCardContent>{item.memo}</IonCardContent>
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
