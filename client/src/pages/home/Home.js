import {useEffect} from "react";
// import useAuth from "../../hooks/useAuth";
import useFirebase from "../../hooks/useFirebase";
import axios from "axios";
import { jsPDF } from 'jspdf';
import  autoTable from "jspdf-autotable";

import ListCall from "../listCall/ListCall";



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

  const generatePDF = () => {
    const doc = new jsPDF();


    let content = document.createElement('div');
    content.style.color = "#000";


    const list = [
      {
        "name" : "Jonathan",
        "here" : true
      },
      {
        "name" : "Sophia",
        "here" : false
      },
      {
        "name" : "Bob",
        "here" : true
      }
    ]



    content.innerHTML = `
      <div style = "list-style-type: none"> 
        <h1 style = "font-size: 20px"> Liste des présences </h1>
        <h5 style = "color: red"> hey </h5>
        <ul>
    `;

    list.forEach(el => {
      const here = el.here ? "Present" : "Absent";

      content.innerHTML += `<li> Nom: ` + el.name + `</li>`;
      content.innerHTML += `<li> Présent: ` + here + `</li>`;
    })


    content.innerHTML += `
    
      </ul>

    </div>
    `
    var elementHTML = content;
    console.log(elementHTML);
    console.log(typeof elementHTML);

    // doc.html(elementHTML, {
    //     callback: function(doc) {
    //         // Save the PDF
    //         const filePath = 'server/pdf';          
    //         doc.save(filePath);
    //         doc.save('sample-document.pdf');
    //     },
    //     x: 15,
    //     y: 15,
    //     width: 170, //target width in the PDF document
    //     windowWidth: 650 //window width in CSS pixels
    // });




};

  
  
  const handleGeneratePDF = () => {
    generatePDF();
  };

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
        <button onClick={handleGeneratePDF}> pdf </button>   
      </div>

        <ListCall />
      
     
    </div>

   
    
  );
}

export default Home;
