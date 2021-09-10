import { IonContent, IonPage, IonButton } from "@ionic/react";
import firebase from "../firebase";
import icon from "../img/logo2.png";
import "./Login.css";

const Login = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  const login = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        var credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.info("ok");
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  };

  return (
    <IonPage>
      <IonContent color="dark">
        <div className="loginpageAll">
          <div className="image">
            <img src={icon} width="80%" height="80%" alt=""></img>
          </div>
          <div className="subtitle">
            <p className="hashtags">
              #About_You <br />
              #Do_You_Remember
              <br />
              #What_Kind_Of_Person
            </p>
            <div className="button">
              <IonButton color="light" onClick={() => login()}>
                Sign in with Google
              </IonButton>
            </div>
          </div>
          {/* <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          /> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
