import React, { useState } from "react";
import "./Popup.scss"

export function PopUp() {
    const [show, setShow] = useState(true)

    function validate() {
        setShow(false);
    }

    return (
        <div>
            {show ? (
                <div className="pop-up">
                    <div className="pop-up-content">
                        <p>Paramétrage de la création de groupes</p>
                        <div className="date-sprint">
                            <div className="date-input">
                                <label>Date de début de Sprint</label>
                                <input type="date" />
                            </div>
                            <div className="date-input">
                                <label>Date de fin de Sprint</label>
                                <input type="date" />
                            </div>
                        </div>
                        <button onClick={validate}>Ok !</button>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );

}