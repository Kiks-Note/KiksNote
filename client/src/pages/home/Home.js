import {useEffect} from "react";
// import useAuth from "../../hooks/useAuth";
import useFirebase from "../../hooks/useFirebase";
import axios from "axios";

function Home() {
  const {user} = useFirebase();

  const sendMail = async () => {
    axios.post("http://localhost:5050/call/exportCall").then(
      (response) => {
        console.log(response.data);
      }
    );
  }

  return (
    <div className="home">
      <h1>Home</h1>
      <p
        style={{
          color: "white",
          fontSize: "20px",
          fontFamily: "poppins-bold",
        }}
      >
        Welcome {user.firstname}
      </p>
      <button onClick={sendMail}> send mail </button>
    </div>
  );
}

export default Home;
