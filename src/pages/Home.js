import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";

const Home = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>#Sharp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>sample</IonContent>
    </IonPage>
  );
};

export default Home;
