import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { InputLabel, Input, Button, IconButton, Alert, Box, Grid, Typography, Stack } from "@mui/material";
import { TextField } from "@material-ui/core";
import PDF from "../overview/020_android_backlog_projet-flashcard.pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./PdfView.scss";

function PdfView() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = PDF;
    link.download = "backlog.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const zoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const zoomOut = () => {
    setScale((prevScale) => prevScale - 0.1);
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
      <div>
        <Grid container spacing={2} sx={{ m: 2 }}>
          <Grid item xs={12} md={7} sx={{ ml: 2 }}>
            <div className="container">
              <div className="root">
                <div className="nav">
                  <IconButton
                    variant="contained"
                    color="primary"
                    onClick={goToPrevPage}
                    className="button"
                    disabled={pageNumber <= 1}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>
                  <p className="pageIndicator">
                    {pageNumber} / {numPages}
                  </p>
                  <Button
                    variant="contained"
                    color="primary"
                    className="button"
                    disabled={scale <= 0.5}
                    onClick={zoomOut}
                  >
                    -
                  </Button>
                  <p className="zoomIndicator"> Zoom: {(scale * 100).toFixed(0)}%</p>

                  <Button variant="contained" color="primary" onClick={zoomIn} disabled={scale >= 2} className="button">
                    +
                  </Button>
                  <IconButton aria-label="download" variant="contained" color="primary" onClick={handleDownload}>
                    <FileDownloadIcon />
                  </IconButton>

                  <IconButton
                    variant="contained"
                    color="primary"
                    onClick={goToNextPage}
                    className="button"
                    disabled={pageNumber >= numPages}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </div>

                <div className="container_pdf">
                  <Document file={PDF} options={{ workerSrc: "/pdf.worker.js" }} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page
                      className="page"
                      pageNumber={pageNumber}
                      size="A4"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={scale}
                      loading=""
                    />
                  </Document>
                </div>
              </div>
            </div>
          </Grid>
          <Grid md={1}></Grid>
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
      </div>
    </>
  );
}

export default PdfView;
