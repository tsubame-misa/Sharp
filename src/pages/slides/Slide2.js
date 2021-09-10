import { IonSlide } from "@ionic/react";
// import img from "../../images/P1.png";
import "./Slide.css";

const Slide2 = () => {
  return (
    <IonSlide>
      <div>
        {/* <div className="logo">
          <img
            src={img}
            alt="ロゴ画像"
            style={{ maxWidth: "400px", width: "90%" }}
          />
        </div> */}
        <div className="position">
          <h2 className="title">#検索</h2>
          <p>簡単に人を探す</p>
        </div>
      </div>
    </IonSlide>
  );
};

export default Slide2;
