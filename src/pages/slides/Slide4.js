import { IonSlide } from "@ionic/react";
import img from "../../images/birthday.png";
import "./Slide.css";

const Slide4 = () => {
  return (
    <IonSlide>
      <div>
        <div>
          <img className="logo" src={img} alt="ロゴ画像" />
          <div className="position">
            <div className="guide-title">#誕生日</div>
            <p>誕生日が近い人を確認する</p>
          </div>
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide4;
