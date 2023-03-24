import React, { useEffect, useState } from "react";
import axios from "axios";
// import Navbar from "../components/navbar/Navbar";


function Test() {
  const [users, setUsers] = useState([]);
  // useEffect(() => {
  //   axios.get("http://localhost:5050/users").then((res) => {
  //     setUsers(res.data);
  //   });
  //   console.log(users);
  // }, [users]);

  return (

      <div>
        {users.map((user) => {
          return (
            // <div key={user.id}>
            //   <h1>User name = {user.name}</h1>
            // </div>
              <div>page test</div>
          )
        })}
      </div>
  );
}

export default Test;
