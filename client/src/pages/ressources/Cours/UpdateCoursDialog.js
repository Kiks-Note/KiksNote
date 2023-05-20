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

import Dropzone from "./Dropzone";

const UpdateCoursDialog = (props) => {
  return (
    <Dialog open={props.openUpdate} onClose={props.handleClose}>
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
              defaultValue={props.coursTitle}
              onChange={(e) => props.setCoursTitle(e.target.value)}
              sx={{
                width: "80%",
              }}
            />
            <TextField
              className="textfield"
              id="date"
              name="date"
              label=" "
              variant="standard"
              type="date"
              defaultValue={props.coursDate || props.coursDate}
              onChange={(e) => props.setCoursDate(e.target.value)}
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
                checked={props.coursCampusNumerique}
                onChange={(event) =>
                  props.setCoursCampusNumerique(event.target.checked)
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
                checked={props.coursPrivate}
                onChange={(event) =>
                  props.setCoursPrivate(event.target.checked)
                }
              />
            </FormControl>
          </div>

          <div className="select-class-allpo-container">
            <Select
              value={props.selectedClass}
              onChange={(event) => props.setSelectedClass(event.target.value)}
              displayEmpty
              renderValue={(value) => value || props.currentClass}
            >
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
                  value={props.allpo.find((po) => po.name === value) || props.currentPO}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : "");
                    props.setCoursOwner(
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
            defaultValue={props.coursDescription}
            onChange={(e) => props.setCoursDescription(e.target.value)}
          />

          <Button
            color="primary"
            sx={{
              marginLeft: "30%",
              marginRight: "30%",
              marginTop: "10px",
            }}
            onClick={props.onSubmit}
          >
            Submit
          </Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateCoursDialog;
