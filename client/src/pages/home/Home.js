import {useEffect} from "react";
// import useAuth from "../../hooks/useAuth";
import useFirebase from "../../hooks/useFirebase";

function Home() {
  const {user} = useFirebase();

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
    </div>
  );
}

export default Home;
