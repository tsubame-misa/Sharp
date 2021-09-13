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
import { searchOutline, peopleOutline } from "ionicons/icons";
import React from "react";

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
        <IonTabs>
          <IonRouterOutlet>
            <Route
              exact
              path="/home"
              render={(props) => {
                return isSignedIn ? <Home {...props} /> : <Login />;
              }}
            />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            {/*よくない？*/}
            <Route path="/search" component={Search} />
            <Route path="/search-blank" component={Search} exact />
            {/* <Route path="/search/:tag" component={Search} /> */}

            <Route exact path="/setting/Guide" component={Guide} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={peopleOutline} />
              <IonLabel>プロフィール</IonLabel>
            </IonTabButton>
            <IonTabButton tab="search" href="/search-blank">
              <IonIcon icon={searchOutline} />
              <IonLabel>検索</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
