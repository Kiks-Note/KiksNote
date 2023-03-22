import React, { useState, useEffect } from "react";
import PDF from "../overview/020_android_backlog_projet-flashcard.pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

function PdfView() {

      // * PDF

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  const goToPrevPage = () =>
		setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

	const goToNextPage = () =>
		setPageNumber(
			pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
		);
  return (
    <div>
      <div>
        <nav>
          <button onClick={goToPrevPage}>Prev</button>
          <button onClick={goToNextPage}>Next</button>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </nav>

        <Document
          file={PDF}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber} 
          />
        </Document>
		  </div>
    </div>
  );
}

export default PdfView;