import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import useFirebase from "../../hooks/useFirebase";
import Modal from "./WidgetModal";
import GridLayout from "react-grid-layout";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

import "./Home.scss";

function Home() {
  const { user } = useFirebase();
  const theme = useTheme();
  const [layouts, setLayouts] = useState([]);
  const [edition, setEdition] = useState(false);
  const addLayout = (newLayout) => {
    let randNumber = Math.floor(Math.random() * 1000);
    var updatedLayout = { ...newLayout, i: randNumber + "%" + newLayout.img + " % " + newLayout.text };

    var isUnique = layouts.every((layout) => layout.i !== updatedLayout.i);
    while (!isUnique) {
      let randNumber = Math.floor(Math.random() * 1000);
      updatedLayout = { ...newLayout, i: randNumber + "%" + newLayout.img + " % " + newLayout.text };
      isUnique = layouts.every((layout) => layout.i !== updatedLayout.i);
    }
    setLayouts((prevLayouts) => [...prevLayouts, updatedLayout]);
  };

  const removeLayout = (layoutToRemove) => {
    setLayouts((prevLayouts) => prevLayouts.filter((layout) => layout.i !== layoutToRemove.i));
  };

  const handleLayoutChange = (newLayouts) => {
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

  useEffect(() => {
    saveLayout();
  }, [layouts]);

  const saveLayout = () => {
    const userId = user.id;

    axios
      .post(`http://localhost:5050/home/saveWidget/${userId}`, { layouts })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="home">
      <div className="home-dashboard">
        <div
          style={{
            width: "65%",
            marginRight: "5%",
            borderStyle: "dashed",
            borderColor: "#0005",
            height: "80vh",
            overflow: "auto",
          }}
          className={edition ? "grid" : ""}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            <Modal
              addLayout={addLayout}
              enterEdition={enterEdition}
              leaveEdition={leaveEdition}
              edition={edition}
              removeLayout={removeLayout}
            />
            {edition && (
              <h2 style={{ marginLeft: "40%", color: "red" }} className="shaky">
                Mode Edition
              </h2>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <GridLayout
              className={"layout"}
              cols={14}
              rowHeight={30}
              layout={layouts}
              width={950}
              onLayoutChange={handleLayoutChange}
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              {layouts.map((card) => (
                <div
                  key={card.i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    borderRadius: "30px",
                  }}
                >
                  {edition && (
                    <DeleteIcon
                      onClick={() => {
                        removeLayout(card);
                      }}
                      style={{ position: "absolute", top: "0", right: "0", color: "red" }}
                    />
                  )}
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
                  >
                    {card.i.split("%")[2]}
                  </p>
                </div>
              ))}
            </GridLayout>
          </div>
        </div>
        <div
          className="news-feed"
          style={{
            backgroundColor: theme.palette.background.container,
            height: "80vh",
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
      </div>
    </div>
  );
}

export default Home;
