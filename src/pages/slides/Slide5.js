import { IonSlide, IonButton } from "@ionic/react";

const Slide5 = () => {
  //TODO直した方がいい
  function logined() {
    if ("visited" in localStorage) {
      return true;
    } else {
      return false;
    }
  }

  function setVisited() {
    if (!logined()) {
      localStorage.setItem("visited", "1");
      window.dispatchEvent(new StorageEvent("storage"));
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
          //routerLink={"/home"}
          fill="outline"
          size="large"
          onClick={() => {
            setVisited();
          }}
          color="test"
        >
          はじめる
        </IonButton>
      </div>
    </IonSlide>
  );
};

export default Slide5;
