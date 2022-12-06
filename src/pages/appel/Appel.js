import { useState } from "react";
import { Button } from "@mui/material";
import QRCode from "qrcode";

function Appel() {
    const [ url , setUrl ] = useState ( '' );
    const [ qrcode , setQrcode ] = useState ( '' );   

    const testUrl = "https://www.google.com/";
    const GenerateQrcode = () => {     
        setUrl(testUrl)
        QRCode.toDataURL(url, (err, url) => {
            if(err) return console.log(err)

            console.log(url)
            setQrcode(url)
        })
    }


    return(
        <div>
            {qrcode && <>
                <img src={qrcode} alt="" />
            </>}
            <button onClick={GenerateQrcode}>test</button>
        </div>
    )
}


export default Appel;