import { useEffect, useState } from "react";
import { useFirebase } from "./config/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import FirebaseExample from "./FirebaseExample";

function App() {
  return <FirebaseExample />;
}

export default App;
