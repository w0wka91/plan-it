import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import React from "react";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  apiId: process.env.API_ID
};

const firebaseApp = firebase.initializeApp(config);

const FirebaseContext = React.createContext<undefined | firebase.app.App>(
  undefined
);

function FirebaseProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <FirebaseContext.Provider value={firebaseApp}>
      {children}
    </FirebaseContext.Provider>
  );
}

function useFirebase() {
  const context = React.useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be called within a FirebaseProvider");
  }
  return {
    firebaseApp: context,
    auth: context.auth(),
    db: context.firestore()
  };
}

export { FirebaseProvider, useFirebase };
