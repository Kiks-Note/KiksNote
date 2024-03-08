import {yupResolver} from "@hookform/resolvers/yup";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import axios from "axios";
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {Document, Page} from "react-pdf";
import * as yup from "yup";
import "./PdfView.scss";

PdfView.propTypes = {
  linkPdf: PropTypes.string.isRequired,
  dashboardId: PropTypes.string.isRequired,
};
function PdfView({linkPdf, dashboardId}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [link, setLink] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      setLink(linkPdf);
    })();
  }, []);
  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages(numPages);
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = link;
    link.download = "backlog.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);
  const schema = yup.object().shape({
    title: yup.string().required("Le titre est obligatoire"),
    description: yup
      .string()
      .max(200, "La description ne doit pas dépasser 200 caractères"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const renderPage = (page) => {
    const canvas = document.getElementById(`canvas-${page.pageNumber}`);
    if (canvas) {
      const context = canvas.getContext("2d");

      // Do something with the canvas context here, e.g. draw a rectangle
      context.fillStyle = "rgba(255, 0, 0, 0.5)";
      context.fillRect(50, 50, 100, 100);
    }

    return (
      <div key={`page-${page.pageNumber}`} className="pdf-page">
        <canvas id={`canvas-${page.pageNumber}`} />
        <Typography variant="h6">Page {page.pageNumber}</Typography>
      </div>
    );
  };
  async function onSubmit(data) {
    const formData = {
      name: data.title,
      desc: data.description,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_API}/dashboard/creation/` +
          dashboardId +
          "/stories",
        formData
      );
      reset(); // Efface les champs après la soumission réussie
    } catch (error) {
      console.error(error);
      // Effectuez ici d'autres traitements en cas d'échec de la requête
    }
  }
  return (
    <>
      <Grid container spacing={2} sx={{m: 2}}>
        <Grid item xs={12} md={7} sx={{ml: 2, mt: 4}}>
          <div className="container">
            <div
              className="nav"
              style={{background: theme.palette.text.secondary}}
            >
              <IconButton
                variant="contained"
                onClick={goToPrevPage}
                className="button"
                disabled={pageNumber <= 1}
              >
                <NavigateBeforeIcon
                  sx={{color: theme.palette.custom.iconPdf}}
                />
              </IconButton>
              <Typography variant="body1">
                {pageNumber} / {numPages}
              </Typography>

              <IconButton
                aria-label="download"
                variant="contained"
                color="primary"
                onClick={handleDownload}
              >
                <FileDownloadIcon sx={{color: theme.palette.custom.iconPdf}} />
              </IconButton>

              <IconButton
                variant="contained"
                onClick={goToNextPage}
                className="button"
                disabled={pageNumber >= numPages}
              >
                <NavigateNextIcon sx={{color: theme.palette.custom.iconPdf}} />
              </IconButton>
            </div>
            <Document
              file={link}
              options={{workerSrc: "/pdf.worker.js"}}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                pageNumber={pageNumber}
                // scale={scale}
                onRenderSuccess={(page) => {
                  renderPage(page);
                }}
              />
            </Document>
          </div>
        </Grid>
        <Grid item xs={12} md={4} sx={{ml: 2, mt: 4}}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              ml: 3,
            }}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography variant="h6">Création des Stories</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel id="title"> Titre </InputLabel>
                <Input
                  id="title"
                  type="text"
                  name="title"
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
                  multiline
                  {...register("description")}
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
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{mt: 3, mb: 2}}
                  >
                    Enregistrer
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default PdfView;
