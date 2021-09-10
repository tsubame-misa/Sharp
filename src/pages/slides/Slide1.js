import { IonSlide } from "@ionic/react";
import img from "../../images/P1.png";
import "./Slide.css";

const Slide1 = () => {
  return (
    <IonSlide>
      <div>
        <div className="logo">
          <img
            src={img}
            alt="ロゴ画像"
            style={{ maxWidth: "400px", width: "90%" }}
          />
        </div>
        <div className="position">
          <h2 className="title">#入力</h2>
          <p>人と会話して情報を増やす</p>
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide1;
