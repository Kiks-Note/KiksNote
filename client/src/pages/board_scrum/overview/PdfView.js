import React, { useState, useEffect } from "react";
import PDF from "../overview/020_android_backlog_projet-flashcard.pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import Button from "@material-ui/core/Button";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./PdfView.scss";

function PdfView() {
  // * PDF

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () => setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  return (
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
          <p className="pageIndicator">
            Page {pageNumber} of {numPages}
          </p>
        </div>

        <div style={{ height: "80vh" }}>
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
        </div>
      </div>
      <div>Création de sprint</div>
    </div>
  );
}

export default PdfView;
