import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { InputLabel, Input, Button, IconButton, Avatar, Alert, Box, Grid, Container, Typography } from "@mui/material";
import { TextField } from "@material-ui/core";
import PDF from "../overview/020_android_backlog_projet-flashcard.pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./PdfView.scss";

import { makeStyles } from "@material-ui/core/styles";

function PdfView() {
  // * PDF
  const useStyles = makeStyles((theme) => ({
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "0 auto",
      maxWidth: 400,
    },
    input: {
      marginBottom: theme.spacing(2),
    },
    submitButton: {
      marginTop: theme.spacing(2),
    },
  }));
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () => setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    mode: "onTouched",
  });
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        title: "",
        description: "",
      });
    }
  }, [formState, isSubmitSuccessful, reset]);
  const sendData = async (data) => {
    console.log(data);
    const formData = {
      title: data.title,
      description: data.description,
    };
    console.log(formData);
    // axios.post("http://localhost:5050/dashboard/", {
    // });
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name + value);
    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };
  return (
    <>
      {isSubmitSuccessful && <Alert severity="success">Vos taches ont été enregrister avec succés</Alert>}
      <Grid container spacing={2} sx={{ m: 2 }}>
        <Grid item xs={12} md={7} sx={{ ml: 2 }}>
          <div className="container">
            <div className="root">
              <div className="nav">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={goToPrevPage}
                  className="button"
                  disabled={pageNumber <= 1}
                >
                  Prev
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={goToNextPage}
                  className="button"
                  disabled={pageNumber >= numPages}
                >
                  Next
                </Button>
              </div>

              <div className="container_pdf">
                <Document file={PDF} options={{ workerSrc: "/pdf.worker.js" }} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page
                    className="page"
                    pageNumber={pageNumber}
                    size="A4"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={null}
                    height={null}
                    loading=""
                  />
                </Document>
                <p className="pageIndicator">
                  {pageNumber} / {numPages}
                </p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid md={2}></Grid>
        <Grid item xs={12} md={2}>
          <>
            <Typography variant="h6">Création des Stories</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                mt: 3,
              }}
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(sendData)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel id="title"> Titre </InputLabel>
                  <Input
                    id="title"
                    type="text"
                    name="title"
                    onChange={handleChange}
                    value={title}
                    {...register("title")}
                  />
                  {errors.title && (
                    <Typography variant="subtitle1" color="error">
                      {errors.title.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <InputLabel id="description"> Description </InputLabel>
                  <Input
                    id="description"
                    aria-describedby="description"
                    onChange={handleChange}
                    multiline
                    value={description}
                    {...register("description", {})}
                    type="text"
                    name="description"
                  />
                  {errors.description && (
                    <Typography variant="subtitle1" color="error">
                      {errors.description.message}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Button variant="contained" type="submit" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
                      Enregistrer
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        </Grid>
        <Grid md={1}></Grid>
      </Grid>
    </>
  );
}

export default PdfView;
