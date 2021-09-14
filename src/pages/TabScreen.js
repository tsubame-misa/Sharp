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
import Home from "./Home";
import Login from "./Login";
import Guide from "./Guide";
import Search from "./Search";
import { searchOutline, peopleOutline } from "ionicons/icons";

import firebase from "../firebase";

const TabScreen = () => {
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
            {/*<Route exact path="/home" />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            {/*よくない？*/}
            <Route exact path="/home" />
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

export default TabScreen;
