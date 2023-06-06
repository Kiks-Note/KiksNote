import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = (props) => {
  const [fileViewer, setFileViewer] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    props.setPdfUrl(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Data = e.target.result;
      setFileViewer(base64Data);
    };

    reader.readAsDataURL(file);
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {fileViewer && (
        <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.js">
          <div style={{ height: "750px" }}>
            <Viewer
              fileUrl={fileViewer}
              plugins={[defaultLayoutPluginInstance]}
            />
          </div>
        </Worker>
      )}
    </>
  );
};

export default PdfViewer;
