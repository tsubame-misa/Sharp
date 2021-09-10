import { IonSlide } from "@ionic/react";
import img from "../../images/make.png";
import "./Slide.css";

const Slide1 = () => {
  return (
    <IonSlide>
      <div>
        <img src={img} alt="ロゴ画像" className="logo" />
        <div className="position">
          <div className="title">#入力</div>
          <p>人と会話して情報を増やす</p>
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide1;
