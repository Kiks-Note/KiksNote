import React from "react";

import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

import PdfViewer from "./PdfViewer";

const UpdateJpoPdf = (props) => {
  return (
    <>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogContent>
          <PdfViewer pdfUrl={props.pdfUrl} setPdfUrl={props.setPdfUrl} />
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
export default UpdateJpoPdf;
