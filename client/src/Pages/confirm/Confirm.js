import React, { useState, useEffect } from "react";
import axios from "axios";

const Confirm = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5050/users")
        .then((res) => {
            // ...
        });
    }, []);

    function setConfirm()
    {
        console.log("test");
    }

    return (
        <div>
            <p>Complété votre inscription en cliquant</p>
            <button onClick={() => setConfirm()}>Ici</button>
        </div>
    );
}

export default Confirm;