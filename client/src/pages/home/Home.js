import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    var updatedLayout = {
      ...newLayout,
      i:
        randNumber +
        "%" +
        newLayout.img +
        " % " +
        newLayout.text +
        " % " +
        newLayout.path,
    };

    console.log(layouts);

    if (layouts !== undefined && layouts.length >= 1) {
      var isUnique = layouts.every((layout) => layout.i !== updatedLayout.i);

      while (!isUnique) {
        randNumber = Math.floor(Math.random() * 1000);
        updatedLayout = {
          ...newLayout,
          i: randNumber + "%" + newLayout.img + " % " + newLayout.text,
        };
        isUnique = layouts.every((layout) => layout.i !== updatedLayout.i);
      }
      setLayouts(layouts.concat(updatedLayout));
    } else {
      var emptyArray = [];
      setLayouts(emptyArray.concat(updatedLayout));
    }

    saveLayout();
  };

  const removeLayout = (layoutToRemove) => {
    setLayouts((prevLayouts) =>
      prevLayouts.filter((layout) => layout.i !== layoutToRemove.i)
    );
    saveLayout();
  };

  const handleLayoutChange = (newLayouts) => {
    setLayouts(newLayouts);
    saveLayout();
  };

  const enterEdition = () => {
    setEdition(true);
    if (layouts) {
      const updatedLayouts = layouts.map((item) => {
        return {
          ...item,
          static: false,
        };
      });
      setLayouts(updatedLayouts);
    } else {
      setLayouts([]);
    }
  };

  const leaveEdition = () => {
    setEdition(false);
    if (layouts) {
      const updatedLayouts = layouts.map((item) => {
        console.log(item);
        return {
          ...item,
          static: true,
        };
      });
      setLayouts(updatedLayouts);
    } else {
      setLayouts([]);
    }
  };

  useEffect(() => {
    const getLayout = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_API}/home/${user.id}`
        );
        setLayouts(response.data.widgets);
      } catch (error) {
        console.error(error);
      }
    };

    getLayout();
  }, [user.id]);

  const saveLayout = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_API}/home/save/${user.id}/widgets`,
        layouts
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="home">
      <div className="home-dashboard">
        <div
          style={{
            width: "90%",
            marginRight: "5%",
            borderStyle: "dashed",
            borderColor: "#0005",
            height: "90vh",
            overflow: "auto",
            padding: "10px",
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
              width={1100}
              onLayoutChange={handleLayoutChange}
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              {layouts &&
                layouts.length > 0 &&
                layouts.map((card) => {
                  return (
                    <Link
                      to={`/${card.i.split("%")[3].split("/")[1]}`}
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
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            color: "red",
                          }}
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
                    </Link>
                  );
                })}
            </GridLayout>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
