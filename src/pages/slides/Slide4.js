import { IonSlide, IonButton } from "@ionic/react";

const Slide4 = () => {
  function logined() {
    if ("visited" in localStorage) {
      return true;
    } else {
      return false;
    }
  }

  function setVisited() {
    if (!logined()) {
      localStorage.setItem("visited", "true");
    }
  }

  return (
    <IonSlide>
      <div className="center_m5">
        <p>
          まずは既に知っている人を
          <br />
          登録してみましょう！
        </p>
        <IonButton
          routerLink={"/home"}
          fill="outline"
          size="large"
          onClick={() => {
            setVisited();
          }}
        >
          はじめる
        </IonButton>
      </div>
    </IonSlide>
  );
};

export default Slide4;
