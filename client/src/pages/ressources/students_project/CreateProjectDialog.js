import React from "react";

import { Controller } from "react-hook-form";

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

const CreateProjectDialog = (props) => {
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Mon formulaire</DialogTitle>
      <DialogContent>
        <form onSubmit={props.handleSubmit}>
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
          <Controller
            name="members"
            control={props.control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                id="member-select"
                sx={{
                  width: "80%",
                }}
                defaultValue={props.membersProject}
                options={props.allstudents}
                getOptionLabel={(option) =>
                  `${option.lastname ? option.lastname.toUpperCase() : ""} ${
                    option.firstname
                  }`
                }
                value={
                  props.allstudents.find((member) => member.name === value) ||
                  ""
                }
                onChange={(event, newValue) => {
                  onChange(newValue ? newValue.id : "");
                  props.setMembersProject(
                    newValue
                      ? `${newValue.lastname.toUpperCase()} ${
                          newValue.firstname
                        }`
                      : null
                  );
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
            )}
          />
          <TextField
            sx={{ marginBottom: "10px", marginTop: "5px" }}
            label="Image du projet"
            fullWidth
            defaultValue={props.imgProjectLink}
            onChange={(event) => props.setImgProjectLink(event.target.value)}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Annuler
        </Button>
        <Button onClick={props.handleSubmit} color="primary">
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateProjectDialog;
