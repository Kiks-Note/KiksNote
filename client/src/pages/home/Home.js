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



    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");
      
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
  );
}

export default Home;
