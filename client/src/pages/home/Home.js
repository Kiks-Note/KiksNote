import React, { useState } from "react";
import { useTheme } from "@mui/material";
import useFirebase from "../../hooks/useFirebase";
import Modal from "./WidgetModal";
import GridLayout from "react-grid-layout";

import "./Home.scss";

function Home() {
  const { user } = useFirebase();
  const theme = useTheme();
  const [layouts, setLayouts] = useState([]);
  const [edition, setEdition] = useState(false);

  const addLayout = (newLayout) => {
    let randNumber = Math.floor(Math.random() * 1000);
    const updatedLayout = { ...newLayout, i: randNumber + "%" + newLayout.img + " % " + newLayout.text };

    var isUnique = layouts.every((layout) => layout.i !== updatedLayout.i);
    while (!isUnique) {
      let randNumber = Math.floor(Math.random() * 1000);
      isUnique = layouts.every((layout) => layout.i !== updatedLayout.i);
    }
    setLayouts((prevLayouts) => [...prevLayouts, updatedLayout]);
  };

  const handleLayoutChange = (newLayouts) => {
    console.log(newLayouts);
    setLayouts(newLayouts);
  };

  const enterEdition = () => {
    setEdition(true);
    const updatedLayouts = layouts.map((item) => {
      return {
        ...item,
        static: false,
      };
    });
    setLayouts(updatedLayouts);
  };

  const leaveEdition = () => {
    setEdition(false);
    const updatedLayouts = layouts.map((item) => {
      return {
        ...item,
        static: true,
      };
    });
    setLayouts(updatedLayouts);
  };

  return (
    <div className="home">
      <Modal addLayout={addLayout} enterEdition={enterEdition} leaveEdition={leaveEdition} />
      <div className="home-dashboard">
        <div
          className="news-feed"
          style={{
            backgroundColor: theme.palette.background.container,
          }}
        >
          <div
            className="news-feed-header"
            style={{
              backgroundColor: theme.palette.background.element,
              padding: "10px",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                fontFamily: "poppins-bold",
                color: "white",
                marginLeft: "10px",
              }}
            >
              Votre Feed
            </p>
          </div>
        </div>
        <div
          style={{
            width: "100%",
          }}
        >
          {console.log(layouts)}
          <GridLayout
            className="layout"
            cols={16}
            rowHeight={30}
            layout={layouts}
            width={1200}
            onLayoutChange={handleLayoutChange}
          >
            {layouts.map((card) => (
              <div
                key={card.i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={card.i.split("%")[1]}
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
                  className={edition ? "shaky" : ""}
                >
                  {card.i.split("%")[2]}
                </p>
              </div>
            ))}
          </GridLayout>
        </div>
      </div>
    </div>
  );
}

export default Home;
