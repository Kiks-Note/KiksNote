import React, { useEffect, useState } from "react";
import axios from "axios";

function Test() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:4000/users").then((res) => {
      setUsers(res.data);
    });
    console.log(users);
  }, []);

  return (
    <div>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <h1>User name = {user.name}</h1>
            
          </div>
        );
      })}
    </div>
  );
}

export default Test;
