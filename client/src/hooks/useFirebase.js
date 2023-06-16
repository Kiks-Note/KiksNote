import axios from "axios";
import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import {collection, doc, getFirestore, onSnapshot} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {useContext, useEffect, useState} from "react";
import {createContext} from "react";
import Cookies from "universal-cookie";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);
export const FirebaseContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const cookies = new Cookies();
  const lastConnectionAt = cookies.get("lastConnectionAt");
  const token = cookies.get("token");
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    // if (lastConnectionAt < Date.now() || !token || !lastConnectionAt) {
    //   logout();
    // }

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        axios
          .post(`${process.env.REACT_APP_SERVER_API}/auth/login`, {
            token: user?.accessToken,
          })
          .then((res) => {
            console.log("Auth state changed to " + user.email);
            const userRef = doc(collection(db, "users"), user.email);
            const _unsub = onSnapshot(userRef, (snap) => {
              setUser({
                id: snap.id,
                ...snap.data(),
                verified: user.emailVerified,
              });
            });
            setUnsubscribe(() => _unsub);
          });
      } else {
        console.log("Auth state changed to disconnected");
        setUser(null);
      }
    });

    return () => {
      authUnsubscribe();
    };
  }, []);

  const logout = async () => {
    cookies.remove("token");
    cookies.remove("lastConnectionAt");
    if (unsubscribe) {
      unsubscribe();
    }
    await signOut(auth);
  };

  return (
    <FirebaseContext.Provider value={{auth, db, user, logout, storage}}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default useFirebase;
