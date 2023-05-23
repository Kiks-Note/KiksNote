import CloseIcon from "@mui/icons-material/Close";
import { IconButton, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import useFirebase from "../../../hooks/useFirebase";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import Autocomplete from "@mui/material/Autocomplete";

export default function SideBarModify({ open, toggleDrawerModify, deviceId }) {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [inputEditorState, setInputEditorState] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useFirebase();
  const handleEditorChange = (e) => {
    setEditorState(e);
    setInputEditorState(draftToHtml(convertToRaw(e.getCurrentContent())));
  };

  useEffect(() => {
    fetchTags();
    setLoading(false);
  }, []);
  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:5050/blog/tag");
      const tags = response.data;
      console.log(tags);

      // Mettre à jour l'état des tags avec les données récupérées
      setTags(tags);
    } catch (error) {
      console.error("Erreur lors de la récupération des tags :", error);
    }
  };
  const reset = () => {
    setTitle("");
    setThumbnail("");
    setEditorState("");
    setInputEditorState("");
    setSelectedTags("");
  };
  const newBlog = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !thumbnail ||
      !editorState ||
      !inputEditorState ||
      !selectedTags
    ) {
      console.log(title, thumbnail, editorState);
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    var statut = "online";
    if (user.status == "etudiant") {
      statut = "pending";
    }
    const blog = {
      title,
      thumbnail,
      editorState,
      inputEditorState,
      created_by: user.id,
      type: "blog",
      tag: selectedTags,
      statut: statut,
    };
    try {
      const response = await axios.post(`http://localhost:5050/blog`, blog);

      toast.success("Tuto ajouté avec succès");
      reset();
      console.log(response.data);
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.log(error);
    }
  };

  const list = () => (
    <>
      <Box
        sx={{
          width: 1450,
          p: 2,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >
        <Typography
          variant="h6"
          sx={{
            marginBottom: 4,
          }}
        >
          Nouveau blog
        </Typography>

        <IconButton
          sx={{
            position: "absolute",
            top: 12,
            right: 5,
          }}
          onClick={(e) => {
            toggleDrawerModify(e, false);
            reset();
          }}
        >
          <CloseIcon />
        </IconButton>

        <>
          <TextField
            sx={{ marginBottom: 2 }}
            id="outlined-search"
            type={"text"}
            name="Titre"
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            InputLabelProps={{ className: "inputLabel" }}
            InputProps={{ className: "input" }}
          />
          <div>
            <Autocomplete
              multiple
              id="tags"
              options={tags}
              getOptionLabel={(tag) => tag.name}
              value={selectedTags}
              onChange={(event, newValue) => {
                setSelectedTags(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </div>
          <div>
            <Editor
              placeholder="Faites chauffer le clavier "
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={handleEditorChange}
              editorStyle={{
                border: "1px solid black",
                minHeight: "180px",
                height: "300px", // Taille fixe de l'éditeur de texte
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
                marginBottom: "16px",
              }}
            />
          </div>
          <TextField
            sx={{ marginBottom: 2 }}
            id="outlined-search"
            label="Image"
            type={"text"}
            name="image"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            fullWidth
            InputLabelProps={{ className: "inputLabel" }}
            InputProps={{ className: "input" }}
          />
          {thumbnail && (
            <>
              <Typography
                variant="subtitle2"
                color={"text.secondary"}
                sx={{
                  alignSelf: "flex-start",
                  marginBottom: 2,
                }}
              >
                Aperçu de l'image :
              </Typography>
              <Box
                component="img"
                sx={{
                  height: 300,
                  width: 350,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt="The house from the offer."
                src={thumbnail ? thumbnail : ""}
              />
            </>
          )}

          <Button
            variant="contained"
            sx={{
              marginBottom: 2,
              width: "100%",
            }}
            fullWidth
            onClick={(e) => {
              newBlog(e);
              toggleDrawerModify(e, false);
            }}
          >
            Confirmer
          </Button>
        </>
      </Box>
    </>
  );

  return (
    <>
      {!loading ? (
        <div>
          <React.Fragment>
            <SwipeableDrawer
              anchor={"right"}
              open={open}
              onClose={(e) => toggleDrawerModify(e, false)}
              onOpen={(e) => toggleDrawerModify(e, true)}
            >
              {list("right")}
            </SwipeableDrawer>
          </React.Fragment>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      )}
    </>
  );
}
