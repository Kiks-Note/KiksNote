import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Alert } from "@mui/material";

import DropZoneImg from "../../../assets/img/dropzone-img.svg";
import ErrorDropzone from "../../../assets/img/warning-dropzone.svg";

const validTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
];

const maxFileSize = 1024 * 1024; // 1.00 MB

const Dropzone = (props) => {
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const message = rejectedFiles[0].errors[0].message;
        setError(`File type not supported or file is too big: ${message}`);
      } else {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setImageData(reader.result);
          props.onFileChange(reader.result);
          setError(null);
        };
      }
    },
    [props]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: validTypes.join(","),
    maxSize: maxFileSize,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed gray",
        padding: "20px",
        textAlign: "center",
        width: "90%",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive && <p>Drop the image file here ...</p>}
      {error ? (
        <>
          <div>
            <Alert severity="error">{error}</Alert>
            <img
              className="img-dropdown-zone"
              src={ErrorDropzone}
              alt="error-img"
            />
          </div>
        </>
      ) : imageData ? (
        <div>
          <img src={imageData} alt="preview" style={{ maxWidth: "100%" }} />
        </div>
      ) : (
        <>
          <img
            className="img-dropdown-zone"
            src={DropZoneImg}
            alt="dropdown-zone-img"
          />
        </>
      )}
    </div>
  );
};

export default Dropzone;
