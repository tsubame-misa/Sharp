import { IonSlide } from "@ionic/react";
import img from "../../images/watch.png";
import "./Slide.css";

const Slide3 = () => {
  return (
    <IonSlide>
      <div>
        <img src={img} alt="ロゴ画像" className="logo" />
        <div className="position">
          <div className="title">#閲覧</div>
          <p>話したことを思い出す</p>
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide3;
