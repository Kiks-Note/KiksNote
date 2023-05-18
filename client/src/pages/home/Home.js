import {useEffect} from "react";
// import useAuth from "../../hooks/useAuth";
import useFirebase from "../../hooks/useFirebase";
import axios from "axios";
import { jsPDF } from 'jspdf';


function Home() {
  const {user} = useFirebase();

  const sendMail = async () => {
    axios.post("http://localhost:5050/call/exportCall").then(
      (response) => {
        console.log(response.data);
      }
    );
  }

  const generatePDF = () => {
    const doc = new jsPDF();



    // doc.text("<h1>Hello world!<h1> <h5> subtitle</h5>", 10, 10);
    // doc.html(`<h1>Hello world!<h1> <h5> subtitle</h5>`)
    // doc.save("a4.pdf");

    // Source HTMLElement or a string containing HTML.
    let content = document.createElement('div');
    content.style.color = "#000";

    content.innerHTML = `
      <div style = "color: 'red'"> 
        <h1> Hey </h1>
        <h5> hey </h5>
        <ul>
          <li>A</li>
          <li>Z</li>
          <li>E</li>
        </ul>
      </div>
    `;
    // let title = document.createElement("h1");
    // title.style.fontSize = "90px"
    // title.innerHTML = "test titre"
    // let p = document.createElement("p");
    // content.appendChild(title)
    // content.appendChild(p)
    // p.innerHTML = "test paragraphe"
    var elementHTML = content;
    console.log(elementHTML);
    console.log(typeof elementHTML);

    doc.html(elementHTML, {
        callback: function(doc) {
            // Save the PDF
            doc.save('sample-document.pdf');
        },
        x: 15,
        y: 15,
        width: 170, //target width in the PDF document
        windowWidth: 650 //window width in CSS pixels
    });
      
    // doc.html(htmlContent, {
    //   callback: function (doc) {
    //     doc.save('generated.pdf');
    //   },
    //   margin: [10, 10, 10, 10],
    //   x: 10,
    //   y: 10
    // });
  };

  
  const handleGeneratePDF = () => {
    generatePDF();
  };

  return (
    <>
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
     
    </div>
    <div style={{ color: "#000"}} id="content">
      <h1> Hey</h1>
      <h5> Test h5 </h5>
      <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
      </ul>
    </div>
    </>
   
    
  );
}

export default Home;
