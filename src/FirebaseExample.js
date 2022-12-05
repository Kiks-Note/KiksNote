import { useEffect, useState } from "react";
import { useFirebase } from "./config/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

function FirebaseExample() {
  const { db } = useFirebase();
  const [test, setTest] = useState();

  const getDb = async () => {
    const docRef = doc(db, "users", "2UMLdxuZ8X4pHBsXdq2m");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTest(docSnap.data().name);
      console.log("Document data:", test);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getDb();
  }, []);

  return (
    <div className="h-[100vh] bg-slate-900 pt-44">
      {
        <p className="text-gray-50 text-3xl font-bold underline text-center">
          {test}
        </p>
      }
    </div>
  );
}

export default FirebaseExample;
