import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import "./JpoInfo.scss";

const PdfViewer = (props) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="jpo-pdf">
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.js">
        <Viewer
          fileUrl={`data:application/pdf;base64,${props.base64}`}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  );
};

export default PdfViewer;
