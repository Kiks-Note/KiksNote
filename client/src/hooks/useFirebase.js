import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import {collection, doc, getFirestore, onSnapshot} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {useContext} from "react";
import {createContext} from "react";
import {useEffect} from "react";
import {useState} from "react";

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

  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Auth state changed to " + user.email);
        const userRef = doc(collection(db, "users"), user.email);
        const _unsub = onSnapshot(userRef, (snap) => {
          setUser({id: snap.id, ...snap.data()});
          //   console.log(snap.data());
        });
        setUnsubscribe(() => _unsub);
      } else {
        console.log("Auth state changed to disconnected");
        setUser(null);
      }
    });

    return authUnsubscribe;
  }, []);

  const logout = async () => {
    unsubscribe();
    await signOut(auth);
  };

  return (
    <FirebaseContext.Provider value={{auth, db, user, logout, storage}}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default useFirebase;
