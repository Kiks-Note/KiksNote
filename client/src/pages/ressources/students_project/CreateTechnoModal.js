import React from "react";

import {
  IconButton,
  Button,
  TextField,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import Dropzone from "../Cours/Dropzone";

import CloseIcon from "@mui/icons-material/Close";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

import "../Cours/Cours.scss";
import "react-toastify/dist/ReactToastify.css";

const CreateTechnoModal = (props) => {
  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxHeight: "calc(100% - 64px)",
          margin: "32px auto",
          overflowY: "visible",
          overflowX: "hidden",
          position: "fixed",
          top: "45%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          "@media (max-width: 600px)": {
            width: "100%",
            maxHeight: "100%",
            margin: 0,
          },
        },
      }}
      open={props.open}
    >
      <DialogActions>
        <IconButton onClick={props.handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogTitle>Création d'une nouvelle techno</DialogTitle>
      <DialogContent
        dividers
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <FormControl>
          <div className="title-cours-date-container">
            <TextField
              className="textfield"
              id="title"
              name="title"
              label="Nom de la techno"
              variant="standard"
              type="text"
              defaultValue={props.technoName}
              onChange={(e) => props.setTechnoName(e.target.value)}
              sx={{
                width: "100%",
              }}
            />
          </div>
          <div className="dropzone-coursimg-container">
            <p className="info-dropdown-img">
              Drag and drop an image file here, or click to select an image
              file. (max. 1.00 MB each) as JPG, PNG, GIF, WebP, SVG or BMP.
            </p>
            <Dropzone
              onDrop={props.handleDrop}
              onFileChange={props.handleFileChange}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag and drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
            {props.rejectedFiles.length > 0 && (
              <div>
                <h4>Rejected files:</h4>
                <ul>
                  {props.rejectedFiles.map((file) => (
                    <li key={file.name}>
                      {file.name} - {file.size} bytes - {file.type}
                      <button onClick={props.handleRemove(file)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button
            sx={{
              margin: "30px",
              padding: "10px",
              backgroundColor: "#7a52e1",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#5c38b8",
              },
            }}
            onClick={props.onSubmit}
            startIcon={<AddCircleRoundedIcon />}
          >
            Créer votre techno
          </Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTechnoModal;
