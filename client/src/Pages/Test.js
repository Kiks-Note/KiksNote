import React, { useEffect, useState } from "react";
import axios from "axios";

function Test() {
  const [inventory, setInventory] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [required] = useState(true);

  const addItem = async () => {
    if (name !== "") {
      const res = await axios.post("http://localhost:5000/inventoryAdd", {
        name: name,
        quantity: quantity,
      });
      console.log(res);
    } else {
      alert("Veuillez remplir tous les champs");
    }
  };

  return (
    <div className="h-[100vh] bg-slate-900 ">
      <h1 className=" text-white text-lg ">Mon Inventaire</h1>
      <div className="flex flex-col justify-center items-center ">
        <input
          placeholder="Nom objet"
          className="bg-slate-800 text-white p-2 rounded-md w-48 mt-10"
          required={required}
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Quantité"
          className="bg-slate-800 text-white p-2 rounded-md w-48 mt-5"
          name="quantity"
          value={quantity === null ? 0 : quantity}
          required={required}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
        />
        <button
          onClick={addItem}
          className="bg-slate-800 text-white p-2 rounded-md w-64 mt-5"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

export default Test;
