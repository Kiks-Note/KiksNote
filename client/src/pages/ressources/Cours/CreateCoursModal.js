import React from "react";
import { Controller } from "react-hook-form";

import {
  IconButton,
  Autocomplete,
  Button,
  TextField,
  MenuItem,
  Select,
  Switch,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

import Dropzone from "./Dropzone";

import "./Cours.scss";
import "react-toastify/dist/ReactToastify.css";

const CreateCoursModal = (props) => {
  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          height: "80%",
          maxHeight: "calc(100% - 64px)",
          margin: "32px auto",
          overflowY: "visible",
          overflowX: "hidden",
          position: "fixed",
          top: "40%",
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
      <DialogTitle>Création de Cours</DialogTitle>
      <DialogContent dividers>
        <FormControl>
          <div className="title-cours-date-container">
            <TextField
              className="textfield"
              id="title"
              name="title"
              label="Nom du cours"
              variant="standard"
              type="text"
              defaultValue={props.courseTitle}
              onChange={(e) => props.setCourseTitle(e.target.value)}
              sx={{
                width: "100%",
              }}
            />
          </div>
          <div className="cours-date-container">
            <div className="title-cours-date-container">
              <p className="p-1">Date de début</p>
              <TextField
                className="textfield"
                id="date"
                name="date"
                variant="standard"
                type="date"
                defaultValue={props.courseDateStart}
                onChange={(e) => props.setCourseDateStart(e.target.value)}
                sx={{
                  width: "50%",
                }}
              />
            </div>
            <div className="title-cours-date-container">
              <p className="p-1">Date de fin</p>
              <TextField
                className="textfield"
                id="date"
                name="date"
                variant="standard"
                type="date"
                defaultValue={props.courseDateEnd}
                onChange={(e) => props.setCourseDateEnd(e.target.value)}
                sx={{
                  width: "50%",
                }}
              />
            </div>
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

          <div className="switch-btn-container">
            <FormControl fullWidth>
              <label
                id="campus-numerique-label"
                style={{ position: "absolute", top: 10 }}
              >
                Campus Numérique
              </label>
              <Switch
                sx={{
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
                labelId="campus-numerique-label"
                checked={props.courseCampusNumerique}
                onChange={(event) =>
                  props.setCourseCampusNumerique(event.target.checked)
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <label
                id="private-label"
                style={{ position: "absolute", top: 10 }}
              >
                En privée
              </label>
              <Switch
                sx={{
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
                labelId="campus-numerique-label"
                checked={props.coursePrivate}
                onChange={(event) =>
                  props.setCoursePrivate(event.target.checked)
                }
              />
            </FormControl>
          </div>

          <div className="select-class-allpo-container">
            <Select
              value={props.selectedClass}
              onChange={(event) => {
                props.setSelectedClass(event.target.value);
                const selectedCours = props.allclass.find(
                  (cours) => cours.name === event.target.value
                );
                props.setIdSelectedClass(selectedCours ? selectedCours.id : "");
              }}
              displayEmpty
              renderValue={(value) => value || "Choisir la classe"}
            >
              <MenuItem value="">Choisir une option</MenuItem>
              {props.allclass.map((cours) => (
                <MenuItem key={cours.id} value={cours.name}>
                  {cours.name}
                </MenuItem>
              ))}
            </Select>

            <Controller
              name="po"
              control={props.control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  id="po-select"
                  sx={{
                    width: "80%",
                  }}
                  options={props.allpo}
                  getOptionLabel={(option) =>
                    `${option.lastname ? option.lastname.toUpperCase() : ""} ${
                      option.firstname
                    }`
                  }
                  value={props.allpo.find((po) => po.id === value) || ""}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : "");
                    props.setCourseOwner(
                      newValue
                        ? `${newValue.lastname.toUpperCase()} ${
                            newValue.firstname
                          }`
                        : null
                    );
                    props.setIdSelectedOwner(newValue ? newValue.id : ""); // Ajout de cette ligne pour définir l'ID du PO
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select a PO"
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                        name: "po",
                      }}
                    />
                  )}
                />
              )}
            />
          </div>

          <TextField
            className="textfield"
            id="desc"
            name="desc"
            label="Description du cours"
            variant="standard"
            type="text"
            multiline
            maxRows={7}
            sx={{
              width: "100%",
            }}
            defaultValue={props.courseDescription}
            onChange={(e) => props.setCourseDescription(e.target.value)}
          />

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
            Créer votre cours
          </Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCoursModal;
