import { IonSlide } from "@ionic/react";
import "./Slide.css";

const Slide0 = () => {
  return (
    <IonSlide>
      <div>
        <div className="logo"></div>
        <div className="position">
          <h2 className="title">Welcome to #Sharp</h2>
          <p>Sharpへようこそ</p>
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide0;
