import React, { useState, useRef } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./PopUp.scss"

export const PopUp = ({ onPopupData }) => {
    const [show, setShow] = useState(true)
    const [classChoose, setClassChoose] = useState("")
    const start_date = useRef();
    const end_date = useRef();
    const nb_release = useRef();

    function validate() {
        let start_date_value = start_date.current.value;
        let end_date_value = end_date.current.value;
        let nb_release_value = nb_release.current.value;

        if (!start_date_value || !end_date_value || !nb_release_value || !classChoose) {
            alert("Veuillez remplir tous les champs");
        } else {
            setShow(false);
            onPopupData({
                start_date: start_date_value,
                end_date: end_date_value,
                nb_release: nb_release_value,
                classChoose: classChoose
            });
        }
    }

    return (
        <div>
            {show ? (
                <div className="pop-up">
                    <div className="pop-up-content">
                        <p>Paramétrage de la création de groupes</p>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-helper-label">Classe</InputLabel>
                            <Select variant="filled" id="input-class" sx={{ color: 'text.primary' }} value={classChoose} onChange={(e) => setClassChoose(e.target.value)}>
                                <MenuItem value="L1-paris">L1-Paris</MenuItem>
                                <MenuItem value="L1-cergy">L1-Cergy</MenuItem>
                                <MenuItem value="L2-paris">L2-Paris</MenuItem>
                                <MenuItem value="L2-cergy">L2-Cergy</MenuItem>
                                <MenuItem value="L3-paris">L3-Paris</MenuItem>
                                <MenuItem value="L3-cergy">L3-Cergy</MenuItem>
                                <MenuItem value="M1-lead">M1-LeadDev</MenuItem>
                                <MenuItem value="M1-gaming">M1-Gaming</MenuItem>
                                <MenuItem value="M2-lead">M2-LeadDev</MenuItem>
                                <MenuItem value="M2-gaming">M2-Gaming</MenuItem>
                            </Select>
                        </FormControl>
                        <input
                            type="text"
                            list="release-list"
                            placeholder="Nombre de release"
                            ref={nb_release}
                        />
                        <datalist id="release-list">
                            <option value={1}></option>
                            <option value={2}></option>
                            <option value={3}></option>
                        </datalist>
                        <div className="date-sprint">
                            <div className="date-input">
                                <label>Date de début de Sprint</label>
                                <input type="date" ref={start_date} />
                            </div>
                            <div className="date-input">
                                <label>Date de fin de Sprint</label>
                                <input type="date" ref={end_date} />
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