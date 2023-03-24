import './Retrospective.scss';
import TextareaAutosize from 'react-textarea-autosize';
import {useEffect, useState} from "react";

var selectedRetro = null;

function Retrospective() {
    const [data, setData] = useState([]);
    const useMountEffect = fun => useEffect(fun, [])
    useMountEffect(() => {
        setData([{name: "Like", postit: []}, {name:"Lacked", postit: []}, {name:"Learned", postit: []}, {name:"Longed for", postit: []}])
    })

    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
        tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput()
    {
        this.style.height = 0;
        this.style.height = (this.scrollHeight) + "px";
    }

    function loadPostitFiller(retroName)
    {
        postitFillerSwitchDisplay(true);
        selectedRetro = retroName;
    }

    function AddPostIt()
    {
        let postitContent = document.querySelector('#postitContent').value;
        console.log(postitContent);
        for (let i = 0; i < data.length; i++) {
            if (data[i].name === selectedRetro) {
                var dataClone = [...data]
                dataClone[i].postit = [...dataClone[i].postit,{content:postitContent}]
                setData(dataClone)
                break;
            }
        }
        postitFillerSwitchDisplay(false);
        document.querySelector('#postitContent').value = null
        selectedRetro = null;
    }

    function DeletePostIt(retroName, Index)
    {
        for (let i = 0; i < data.length; i++) {
            if (data[i].name === retroName){
                var dataClone = [...data]
                dataClone[i].postit.splice(Index,1)
                setData(dataClone)
                return undefined
            }
        }
    }

    function postitFillerSwitchDisplay(show)
    {
        let postitFiller = document.querySelector('#PostItFiller');
        console.log(show);
        if(show)
            postitFiller.style.display = "flex";
        else
            postitFiller.style.display = "none";
    }

    return(
        <div id="Retrospective">
            <img id="Tableau" src={require("../../img/Tableau.png")} alt="tableau"/>
            {data.map(retro =>
                <div key={retro.name + "-C"} className="Categorie">
                    <div key={retro.name + "-CT"} className="CategorieType">
                        <img key={retro.name + "-I"} src={require(`../../img/${retro.name}.png`)} alt={retro.name}/>
                        <p key={retro.name + "-N"}>{`${retro.name}`}</p>
                    </div>
                    <div key={retro.name + "-PS"} className="PostSpace">
                        {retro.postit.map((postit, index) =>
                        <div key={retro.name + "-" + index + "-P"}>
                            <TextareaAutosize key={retro.name + "-" + index + "-PI"} className="PostIt" value={postit.content}></TextareaAutosize>
                            <button key={retro.name + "-" + index + "-PF"} onClick={DeletePostIt.bind(this,retro.name,index)} className="PostitFlip">
                                <img key={retro.name + "-" + index + "-I"} src={require("../../img/PostitFlip.png")} alt="coin décollé"/>
                            </button>
                        </div>
                        )}
                        <button id="AddPostItBtn"
                        onClick={loadPostitFiller.bind(this, retro.name)}>+</button>
                    </div>
                </div>
            )}
            <div id="PostItFiller">
                <input id="postitContent" placeholder='Écrire un nouveau postit ...' type='text'/>
                <button id="validate" onClick={AddPostIt}>Valider</button>
                <button id="close" onClick={postitFillerSwitchDisplay.bind(this, false)}>X</button>
            </div>
        </div>
    );
}

export default Retrospective;