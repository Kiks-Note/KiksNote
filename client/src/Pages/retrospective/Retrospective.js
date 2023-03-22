import './Retrospective.scss';
import TextareaAutosize from 'react-textarea-autosize';

function Retrospective() {

    const data = [{name: "Like", postit: [{content:"React est facile"},{content:"Play Robocraft"}]}, {name:"Négatif", postit: [{content:"La BDD"}]}, {name:"Amélioration", postit: [{content:"Mieux renseigner le fonctionnement des requêtes avec la techno utilisé pour la bdd et l'appel de la bdd"}]}, {name:"Longed for", postit: [{content:"La BDD"}]}]

    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
        tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
        this.style.height = 0;
        this.style.height = (this.scrollHeight) + "px";
    }

    void function AddPostIt(Categorie)
    {
        console.log("add");
        for (const retro in data) {
            if (retro.name === Categorie){
                retro.postit.push({content:""})
                console.log(retro.toString())
            }
        }
    }

    void function DeletePostIt(Categorie, Content)
    {
        console.log("delete");
        for (const retro in data) {
            if (retro.name === Categorie){
                let i = 0;
                for (const postit in retro) {
                    if(postit.content === Content) {
                        retro.slice(i,1);
                        console.log(retro.toString())
                    }
                    i++;
                }
            }
        }
    }

    return(
        <div id="Retrospective">
            <img id="Tableau" src={require("../../img/Tableau.png")} alt="image de tableau"/>
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
                            <button key={retro.name + "-" + index + "-PF"} onClick={DeletePostIt(retro.name,postit.content)} className="PostitFlip">
                                <img key={retro.name + "-" + index + "-I"} src={require("../../img/PostitFlip.png")} alt="Coin décollé"/>
                            </button>
                        </div>)}
                        <button key={retro.name + "-A"} onClick={AddPostIt(retro.name)}>Coller un post-it</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Retrospective;