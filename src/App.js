import { Redirect, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Guide from "./pages/Guide";
import Search from "./pages/Search";
import { playCircleOutline, playBackCircleOutline } from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import firebase from "./firebase";

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        {isSignedIn ? (
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/home" component={Home} />
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route exact path="/search" component={Search} />
              <Route exact path="/setting/Guide" component={Guide} />
            </IonRouterOutlet>

            <IonTabBar slot="bottom" color="dark">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={playCircleOutline} />
                <IonLabel>録画リスト</IonLabel>
              </IonTabButton>
              <IonTabButton tab="search" href="/search">
                <IonIcon icon={playBackCircleOutline} />
                <IonLabel>録画済み</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        ) : (
          <Login />
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
