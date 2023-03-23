import React, { useState, useEffect } from "react";
import PDF from "../overview/020_android_backlog_projet-flashcard.pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  pageIndicator: {
    alignSelf: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

function PdfView() {
  const classes = useStyles();

  // * PDF

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () => setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.nav}>
          <Button
            variant="contained"
            color="primary"
            onClick={goToPrevPage}
            className={classes.button}
            disabled={pageNumber <= 1}
          >
            Prev
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={goToNextPage}
            className={classes.button}
            disabled={pageNumber >= numPages}
          >
            Next
          </Button>
          <p className={classes.pageIndicator}>
            Page {pageNumber} of {numPages}
          </p>
        </div>

        <Document file={PDF} options={{ workerSrc: "/pdf.worker.js" }} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            className={classes.page}
            scale={1.5}
            pageNumber={pageNumber}
            size="A4"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
      <div>Création de sprint</div>
    </div>
  );
}

export default PdfView;
