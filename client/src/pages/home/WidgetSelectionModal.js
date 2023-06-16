import React, { useState } from "react";
import { useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import GridLayout from "react-grid-layout";

const WidgetSelection = ({ open, handleClose, img, text, addLayout }) => {
  const theme = useTheme();

  const layout = [
    { i: "a", x: 0, y: 0, w: 2, h: 3, static: true, img: img, text: text },
    { i: "ab", x: 0, y: 0, w: 2, h: 2, static: true, img: img, text: text },
    { i: "b", x: 12, y: 0, w: 3, h: 4, static: true, img: img, text: text },
    { i: "bb", x: 12, y: 0, w: 3, h: 3, static: true, img: img, text: text },
    { i: "c", x: 2, y: 0, w: 3, h: 5, static: true, img: img, text: text },
    { i: "d", x: 12, y: 0, w: 4, h: 6, static: true, img: img, text: text },
    { i: "e", x: 0, y: 5, w: 5, h: 8, static: true, img: img, text: text },
    { i: "f", x: 5, y: 0, w: 7, h: 10, static: true, img: img, text: text },
    { i: "fb", x: 5, y: 10, w: 7, h: 3, static: true, img: img, text: text },
    { i: "ac", x: 0, y: 13, w: 5, h: 3, static: true, img: img, text: text },
    { i: "ae", x: 5, y: 13, w: 3, h: 3, static: true, img: img, text: text },
    { i: "ad", x: 8, y: 13, w: 4, h: 3, static: true, img: img, text: text },
    { i: "af", x: 12, y: 13, w: 2, h: 3, static: true, img: img, text: text },
  ];

  return (
    <div>
      <Modal open={open}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "80%",
            height: "80vh",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <h2 style={{ color: "black" }}>
            Choissisez la taille du Widget {text}
          </h2>
          <GridLayout
            className="layout"
            cols={16}
            rowHeight={30}
            layout={layout}
            width={1000}
          >
            {layout.map((card) => (
              <div
                onClick={() => {
                  const modifiedCard = {
                    ...card,
                    x: 0,
                    y: 0,
                  };
                  addLayout(modifiedCard);
                }}
                key={card.i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  borderRadius: "10px",
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              >
                <img
                  src={img}
                  alt="illustration"
                  style={{
                    backgroundColor: theme.palette.custom.button,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
                <p
                  style={{
                    color: theme.palette.text.primary,
                    backgroundColor: "#0005",
                    position: "absolute",
                    width: "100%",
                    height: "30%",
                    bottom: "0",
                    left: "0",
                    margin: "0",
                    maxHeight: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  {card.h} x {card.w}
                </p>
              </div>
            ))}
          </GridLayout>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default WidgetSelection;
