import {useEffect} from "react";
// import useAuth from "../../hooks/useAuth";
import useFirebase from "../../hooks/useFirebase";
import axios from "axios";
import { jsPDF } from 'jspdf';
import  autoTable from "jspdf-autotable";


function Home() {

  const {user} = useFirebase();

  const sendMail = async () => {
    const doc = new jsPDF();

    const studentListCall = [
      {'name': 'David', 'classe': "L1TP", 'course': 'HTML/CSS', 'date': '22/09/2022', 'presence' : true},
      {'name': 'Antoine', 'classe': "L1TP", 'course': 'HTML/CSS', 'date': '22/09/2022', 'presence' : true},
      {'name': 'Jean', 'classe': "L1TP", 'course': 'HTML/CSS', 'date': '22/09/2022', 'presence' : false},
      {'name': 'Mohamed', 'classe': "L1TP", 'course': 'HTML/CSS', 'date': '22/09/2022', 'presence' : true},
      {'name': 'Celine', 'classe': "L1TP", 'course': 'HTML/CSS', 'date': '22/09/2022', 'presence' : true},
    ]

    autoTable(doc, {
      head: [['Nom', 'Classe', 'Cours', "Date", "Presence"]],
      body: studentListCall.map((student) => {
          let presence = student["presence"] ? "Present(e)" : "Absent(e)";
          return [student["name"], student["classe"], student["course"], student["date"], presence];
        })
    })

    const pdfBuffer = doc.output();

    axios.post("http://localhost:5050/call/exportCall", {
      pdfBuffer : pdfBuffer
    }).then(
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
      <div style={{display:"flex",flexDirection:"column"}}>
        <button onClick={sendMail}> send mail </button>
      </div>
           
    </div>

   
    
  );
}

export default Home;
