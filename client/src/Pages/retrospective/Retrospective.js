import './Retrospective.scss';
import TextareaAutosize from 'react-textarea-autosize';
import {useEffect, useState} from "react";

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

    function OnInput() {
        this.style.height = 0;
        this.style.height = (this.scrollHeight) + "px";
    }

    function AddPostIt(Categorie)
    {
        for (let i = 0; i < data.length; i++) {
            if (data[i].name === Categorie){
                var dataClone = [...data]
                dataClone[i].postit = [...dataClone[i].postit,{content:""}]
                setData(dataClone)
                console.log(data[i])
                return undefined
            }
        }
    }

    function DeletePostIt(Categorie, Index)
    {
        for (let i = 0; i < data.length; i++) {
            if (data[i].name === Categorie){
                var dataClone = [...data]
                dataClone[i].postit.splice(Index,1)
                setData(dataClone)
                console.log(data[i])
                return undefined
            }
        }
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
                        <button key={retro.name + "-A"} onClick={AddPostIt.bind(this,retro.name)}>Coller un post-it</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Retrospective;