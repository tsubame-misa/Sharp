import { IonSlide } from "@ionic/react";
import img from "../../images/search.png";
import "./Slide.css";

const Slide2 = () => {
  return (
    <IonSlide>
      <div>
        <div>
          <img className="logo" src={img} alt="ロゴ画像" />
          <div className="position">
            <div className="guide-title">#検索</div>
            <p>簡単に人を探す</p>
          </div>
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide2;
