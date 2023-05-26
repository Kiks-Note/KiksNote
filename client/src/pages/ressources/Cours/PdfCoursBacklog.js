import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

const CourseBacklogPdf = ({ urlPdf }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const goToPrevPage = () => {
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);
  };

  const goToNextPage = () => {
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const location = useLocation();
  const urlBacklogPdf = location.state.urlBacklogPdf;

  console.log(urlBacklogPdf);

  return (
    <div>
      <h1>PDF BACKLOG</h1>
      <nav>
        <button onClick={goToPrevPage}>Prev</button>
        <button onClick={goToNextPage}>Next</button>
      </nav>
      <Document onLoadSuccess={onDocumentLoadSuccess}>
        <Page file={urlBacklogPdf} pageNumber={pageNumber} />
      </Document>
    </div>
  );
};

export default CourseBacklogPdf;
