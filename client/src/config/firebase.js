import { initializeApp } from "firebase/app";
import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig, "app");
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        console.log("User is logged in" + user.email);
        const userRef = doc(collection(db, "users"), user.email);
        const _unsub = onSnapshot(userRef, (snap) => {
          setUser(snap);
          console.log(snap.data());
        });
        setUnsubscribe(() => _unsub);
        setLoading(false);
      } else {
        console.log("User is logged out");
        setUser(null);
        setLoading(false);
      }
    });
    return authUnsubscribe;
  }, []);

  const logout = async () => {
    unsubscribe();
    await signOut(auth);
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <FirebaseContext.Provider
      value={{
        auth,
        db,
        user,
        storage,
        logout,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContextProvider;
