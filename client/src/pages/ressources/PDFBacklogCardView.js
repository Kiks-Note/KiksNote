import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import PDF from '../ressources/020_android_backlog_projet-flashcard.pdf';

export default function CardView() {

  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  const goToPrevPage = () => {
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);
  }

  const goToNextPage = () => {
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }

  return (
    <div>
        <h1>PDF BACKLOG</h1>
        <nav>
          <button onClick={goToPrevPage}>Prev</button>
          <button onClick={goToNextPage}>Next</button>
        </nav>
        <Document 
          file={PDF}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber}/>
			  </Document>
    </div>
  );
}