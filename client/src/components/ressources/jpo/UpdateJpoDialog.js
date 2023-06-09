import React, { useState, useEffect } from "react";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";

import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Dropzone from "./../Dropzone";

const UpdateCoursDialog = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  console.log(props.descriptionJPO);

  return (
    <>
      <Dialog open={props.open} onClose={props.handleClose}>
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

            <Editor
              placeholder={`Commencer à écrire une petite description de la JPO ${props.nameJPO}`}
              // onEditorStateChange={handleEditorChange}
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              editorStyle={{
                border: "1px solid black",
                minHeight: "180px",
                height: "300px",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
                marginBottom: "16px",
              }}
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
                        <button onClick={props.handleRemove(file)}>
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} className={props.btnCreateJpo}>
            Annuler
          </Button>
          <Button onClick={props.handleSubmit} className={props.btnCreateJpo}>
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default UpdateCoursDialog;
