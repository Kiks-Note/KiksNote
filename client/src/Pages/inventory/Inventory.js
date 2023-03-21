import React from "react"
import Popup from 'reactjs-popup';

import "./Inventory.scss"
function Computer(){
    const computerArray =[
        {
            Category:"Mac",
            reference:"38",
            state:"Neuf",
            disponibility:true,
            campus:"Cergy",
        },
        {
            Category:"Mac",
            reference:"8",
            state:"Ancien",
            disponibility:true,
            campus:"Cergy",
        },
        {
            Category:"Mac",
            reference:"39",
            state:"Barre d'espace endommagé",
            disponibility:true,
            campus:"Paris",
        },
        {
            Category:"Mac",
            reference:"23",
            state:"Volé",
            disponibility:false,
            campus:"Cergy",
        }
    ]    
    const computerMap = computerArray.map((computMap) => {

        return(
            
            <div className={'paddingRow'} key={computMap.reference}>
                <div className="btnClass">
                <span className="dot"  style={computMap.disponibility ? {backgroundColor : "green"} : {backgroundColor : "red"}}></span>

                    <h2>{computMap.Category}</h2>
                    <h3>Référence : {computMap.reference}</h3>
                    <h3>Etat de l'appareil : {computMap.state}</h3>
                    <h3>Campus : {computMap.campus}</h3>
                </div>
            </div>
            
        )
    })
    
    return(
        <div>
            <h1 className="center">Mac</h1>
            <div className="listRow">
                {computerMap}
            </div>
        </div>
    )
  
}

function Inventory(){
    return(
        <div>
            <h1>Inventory</h1>


            <input></input>
            <Computer />

            <h2>Casques VR</h2>
            <div>

            </div>

            <h2>imprimantes</h2>
            <div>

            </div>

            <h2>Livres</h2>
            <div>
                <div>
                <Popup
    trigger={<button className="addBtn"> Ajouter un nouvel appareil </button>}
    modal
    nested
  >
    {close => (
      <div className="modal">
        <button className="close" onClick={close}>
          &times;
        </button>
        <div className="header"> Nouvel appareil </div>
        <div>
            <form>
                <div className="formDevice">Type d'appareil : <input /></div>
                <div className="formDevice">Etat de l'appareil : <input /></div>
                <div className="formDevice">Réference de l'appareil : <input /></div>
                <div className="formDevice">Campus de l'appareil : <input /></div>

            </form>
        </div>
        <div className="actions">
          <button
            className="button"
            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            close modal
          </button>
        </div>
      </div>
    )}
  </Popup>


                </div>
            </div>

        </div>
    )
}

export default Inventory