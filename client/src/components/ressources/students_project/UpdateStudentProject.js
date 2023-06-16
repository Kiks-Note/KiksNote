import React from "react";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Select,
  MenuItem,
  Autocomplete,
  Typography,
} from "@mui/material";

import Dropzone from "../Dropzone";

import "./../../../pages/ressources/students_project/StudentsProjects";

const UpdateProjectDialog = (props) => {
  return (
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
            placeholder={`Commencer à écrire une petite description de ton projet ${props.nameProject}`}
            // sx={{ marginBottom: "10px", marginTop: "5px" }}
            label="Description de votre Projet"
            fullWidth
            multiline
            rows={5}
            defaultValue={props.descriptionProject}
            onChange={(e) => props.setDescriptionProject(e.target.value)}
          />
          <div className="dropzone-coursimg-container">
            <p className="info-dropdown-img">
              Drag and drop an image file here, or click to select an image
              file. (max. 1.00 MB each) as PNG.
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

          <Autocomplete
            multiple
            id="tags-outlined"
            sx={{
              width: "100%",
            }}
            options={props.allclass}
            getOptionLabel={(option) => (
              <>
                <Typography>{option.name}</Typography>
              </>
            )}
            defaultValue={props.promoProject}
            filterSelectedOptions
            onChange={(event, newValue) => {
              const selectedPromos = newValue.map((promo) => promo.id);
              props.setPromoProject(selectedPromos);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a promo"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  name: "promo",
                }}
              />
            )}
          />

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
          <Autocomplete
            multiple
            id="tags-outlined"
            sx={{
              width: "100%",
              marginTop: "10px",
            }}
            options={props.alltechnos}
            getOptionLabel={(option) => (
              <>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={option.image}
                    alt={option.name}
                    style={{ width: "40px", marginRight: "10px" }}
                  />
                  {option.name}
                </div>
              </>
            )}
            defaultValue={props.technosProject}
            filterSelectedOptions
            onChange={(event, newValue) => {
              const selectedTechnos = newValue.map((techno) => techno.id);
              props.setTechnosProject(selectedTechnos);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select technos"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  name: "technos",
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
export default UpdateProjectDialog;
