import {useEffect} from "react";
import useAuth from "../../hooks/useAuth";

function Home() {
  const {user} = useAuth();

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
