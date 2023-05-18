import React, { useState, useRef, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, Button } from "@mui/material";
import "./PopUp.scss";

export const PopUp = ({ onPopupData, dataPopUp,showPopUp }) => {
    const [classChoose, setClassChoose] = useState("");
    const start_date = useRef();
    const end_date = useRef();
    const nb_release = useRef();
    const popUpRef = useRef();


    useEffect(() => {
        if (dataPopUp) {
            setClassChoose(dataPopUp.classChoose);
            if (start_date.current) {
                start_date.current.value = dataPopUp.start_date;
            }

            if (end_date.current) {
                end_date.current.value = dataPopUp.end_date;
            }

            if (nb_release.current) {
                nb_release.current.value = dataPopUp.nb_release;
            }
        }
    }, [dataPopUp]);

    function validate() {
        if (!classChoose || !start_date.current.value || !end_date.current.value) {
            alert("Veuillez remplir tous les champs");
        } else {
            onPopupData({
                start_date: start_date.current.value,
                end_date: end_date.current.value,
                classChoose: classChoose
            });
        }
    }

    function closePopUp() {
        showPopUp(false);
    }

    return (
        <div>
            <div className="pop-up">
                <div className="pop-up-content" ref={popUpRef}>
                    <p>Paramétrage de la création de groupes</p>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">Classe</InputLabel>
                        <Select
                            variant="filled"
                            id="input-class"
                            sx={{ color: "text.primary" }}
                            value={classChoose}
                            onChange={(e) => setClassChoose(e.target.value)}
                        >
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

                    <div className="date-sprint">
                        <div className="date-input">
                            <label>Date de début de Sprint</label>
                            <input
                                type="date"
                                defaultValue={dataPopUp ? dataPopUp.start_date : ""}
                                ref={start_date}
                            />
                        </div>
                        <div className="date-input">
                            <label>Date de fin de Sprint</label>
                            <input
                                type="date"
                                defaultValue={dataPopUp ? dataPopUp.end_date : ""}
                                ref={end_date}
                            />
                        </div>
                    </div>
                    {dataPopUp ? <Button onClick={closePopUp}>Annuler</Button> : null}
                    <Button variant="contained" onClick={validate}>Ok !</Button>
                </div>
            </div>
        </div>
    );
};
