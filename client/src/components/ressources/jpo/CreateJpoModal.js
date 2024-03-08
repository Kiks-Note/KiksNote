import React from "react";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Autocomplete,
} from "@mui/material";

import Dropzone from "./../Dropzone";

import "./../../../pages/ressources/jpo/JpoInfo.scss";

const CreateJpoModal = (props) => {
  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "1000px",
            },
          },
        }}
      >
        <DialogContent>
          <form onSubmit={props.handleSubmit} className="jpo-form">
            <TextField
              sx={{ marginBottom: "10px", marginTop: "5px" }}
              label="Nom de la JPO"
              fullWidth
              defaultValue={props.nameJPO}
              onChange={(event) => props.setNameJPO(event.target.value)}
            />
            <div className="jpo-date-container">
              <p className="p-start-end-date-jpo-label">Début</p>
              <TextField
                className="textfield"
                id="date"
                name="date"
                variant="standard"
                type="date"
                defaultValue={props.JPODateStart}
                onChange={(e) => props.setJPODateStart(e.target.value)}
                sx={{ width: "90%" }}
              />
            </div>
            <div className="jpo-date-container">
              <p className="p-start-end-date-jpo-label ">Fin</p>
              <TextField
                className="textfield"
                id="date"
                name="date"
                variant="standard"
                type="date"
                defaultValue={props.JPODateEnd}
                onChange={(e) => props.setJPODateEnd(e.target.value)}
                sx={{ width: "90%" }}
              />
            </div>
            <Autocomplete
              multiple
              id="tags-outlined"
              sx={{
                width: "100%",
                marginBottom: "10px",
              }}
              options={props.allJpoParticipants}
              getOptionLabel={(option) =>
                `${option.lastname ? option.lastname.toUpperCase() : ""} ${
                  option.firstname
                }`
              }
              defaultValue={props.jpoParticipants}
              filterSelectedOptions
              onChange={(event, newValue) => {
                const selectedJpoParticipant = newValue.map(
                  (jpomember) => jpomember.id
                );
                props.setJpoParticipants(selectedJpoParticipant);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select a JpoParticipant"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    name: "student",
                  }}
                />
              )}
            />
            <TextField
              placeholder={`Commencer à écrire une petite description de la JPO ${props.nameJPO}`}
              sx={{ marginBottom: "10px", marginTop: "5px" }}
              label="Description JPO"
              fullWidth
              multiline
              rows={5}
              defaultValue={props.descriptionJPO}
              onChange={(e) => props.setDescriptionJPO(e.target.value)}
            />
          </form>
          <TextField
            placeholder="Lien de l'image de votre jpo"
            sx={{ marginBottom: "10px", marginTop: "5px" }}
            label="Lien image JPO"
            fullWidth
            defaultValue={props.jpoThumbnail}
            onChange={(e) => props.setJpoThumbnail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} className={props.btnCreateJpo}>
            Annuler
          </Button>
          <Button onClick={props.handleSubmit} className={props.btnCreateJpo}>
            Publier
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateJpoModal;
