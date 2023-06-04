import React from "react";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";

import Dropzone from "../Cours/Dropzone";

import "./StudentsProjects.scss";

const CreateProjectDialog = (props) => {
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogContent>
        <form onSubmit={props.handleSubmit} className="student-project-form">
          <TextField
            sx={{ marginBottom: "10px", marginTop: "5px" }}
            label="Nom du projet"
            fullWidth
            defaultValue={props.nameProject}
            onChange={(event) => props.setNameProject(event.target.value)}
          />
          <TextField
            sx={{ marginBottom: "10px" }}
            label="Lien github du projet"
            fullWidth
            defaultValue={props.repoProjectLink}
            onChange={(event) => props.setRepoProjectLink(event.target.value)}
          />
          <TextField
            sx={{ marginBottom: "10px" }}
            label="Description du projet"
            fullWidth
            multiline
            rows={4}
            defaultValue={props.descriptionProject}
            onChange={(event) =>
              props.setDescriptionProject(event.target.value)
            }
          />
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
          <Select
            sx={{ marginBottom: "10px" }}
            value={props.typeProject}
            onChange={(event) => props.setTypeProject(event.target.value)}
            displayEmpty
            renderValue={(value) => value || "Choisir son type"}
          >
            <MenuItem key="1" value="Web">
              Web
            </MenuItem>
            <MenuItem key="2" value="Mobile">
              Mobile
            </MenuItem>
            <MenuItem key="3" value="Gaming">
              Gaming
            </MenuItem>
            <MenuItem key="4" value="IA">
              IA
            </MenuItem>
            <MenuItem key="5" value="DevOps">
              DevOps
            </MenuItem>
          </Select>
          <Select
            value={props.selectedClass}
            sx={{ marginBottom: "10px" }}
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
          <Autocomplete
            multiple
            id="tags-outlined"
            sx={{
              width: "100%",
            }}
            options={props.allstudents}
            getOptionLabel={(option) =>
              `${option.lastname ? option.lastname.toUpperCase() : ""} ${
                option.firstname
              }`
            }
            defaultValue={props.membersProject}
            filterSelectedOptions
            onChange={(event, newValue) => {
              const selectedMembers = newValue.map((member) => member.id);
              props.setMembersProject(selectedMembers);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a student"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  name: "student",
                }}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.handleClose}
          sx={{ backgroundColor: "#7a52e1", color: "white" }}
        >
          Annuler
        </Button>
        <Button
          onClick={props.handleSubmit}
          sx={{ backgroundColor: "#7a52e1", color: "white" }}
        >
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateProjectDialog;
