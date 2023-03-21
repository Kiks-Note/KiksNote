import {
  Button,
  Fab,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";
import moment from "moment";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SideBarModify from "./inventory/SideBarModify";
import SideBarModifyRequest from "./inventory/SideBarModifyRequest";
import timeConverter from "../functions/TimeConverter";

function Row(props) {
  const {row, edit, onEditClick} = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{"& > *": {borderBottom: "unset"}}}>
        <TableCell style={{width: "2%"}}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            <KeyboardArrowDownIcon
              sx={{
                color: "primary.main",
                transition: "all 0.3s ease-in-out",
                transform: open ? "rotate(180deg)" : "rotate(360deg)",
                "&:hover": {
                  color: "primary.dark",
                },
              }}
            />
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{fontFamily: "poppins-regular"}}
        >
          {row.device.id}
        </TableCell>
        <TableCell sx={{fontFamily: "poppins-regular"}}>
          {row.device.label}
        </TableCell>
        <TableCell sx={{fontFamily: "poppins-regular"}}>
          {row.device.ref}
        </TableCell>
        <TableCell sx={{fontFamily: "poppins-regular"}}>
          {row.device.category}
        </TableCell>
        <TableCell sx={{fontFamily: "poppins-regular"}}>
          {row.device.campus}
        </TableCell>
        <TableCell sx={{fontFamily: "poppins-regular"}}>
          {row.device.status === "available"
            ? "Disponible"
            : row.device.status === "borrowed"
            ? "Prêté"
            : row.device.status === "requested"
            ? "Demandé"
            : row.device.status === "unavailable"
            ? "Indisponible"
            : "Inconnu"}
        </TableCell>
      </TableRow>
      <TableRow
        sx={{
          "& > *": {
            borderBottom: "none",
          },
        }}
      >
        <TableCell
          style={{paddingBottom: 0, paddingTop: 0, width: "100%"}}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TableContainer>
              <Box
                sx={{
                  height: 300,
                  overflow: "auto",
                  margin: 1,
                  resize: "vertical",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{fontFamily: "poppins-semibold"}}
                >
                  Historique
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{fontFamily: "poppins-semibold"}}>
                        ID
                      </TableCell>
                      <TableCell sx={{fontFamily: "poppins-semibold"}}>
                        Demandeur
                      </TableCell>
                      <TableCell
                        style={{width: "10%"}}
                        sx={{fontFamily: "poppins-semibold"}}
                      >
                        Creé
                      </TableCell>
                      <TableCell sx={{fontFamily: "poppins-semibold"}}>
                        Debut
                      </TableCell>
                      <TableCell sx={{fontFamily: "poppins-semibold"}}>
                        Fin
                      </TableCell>
                      <TableCell
                        style={{width: "7%"}}
                        sx={{fontFamily: "poppins-semibold"}}
                      >
                        Statut
                      </TableCell>
                      {/* <TableCell sx={{fontFamily: "poppins-semibold"}}>
                        Date
                      </TableCell> */}

                      <TableCell sx={{fontFamily: "poppins-semibold"}}>
                        Rendu
                      </TableCell>
                      {/* {edit && (
                        <TableCell sx={{fontFamily: "poppins-semibold"}}>
                          Actions
                        </TableCell>
                      )} */}
                    </TableRow>
                  </TableHead>
                  <TableBody
                    sx={{
                      "& > *": {
                        borderBottom: "unset",
                      },
                    }}
                  >
                    {row.history
                      .sort((a, b) => {
                        // Sort by status
                        if (a.status === "pending" && b.status !== "pending")
                          return -1;
                        if (a.status !== "pending" && b.status === "pending")
                          return 1;
                        if (a.status === "accepted" && b.status !== "accepted")
                          return -1;
                        if (a.status !== "accepted" && b.status === "accepted")
                          return 1;
                        if (a.status === "refused" && b.status !== "refused")
                          return -1;
                        if (a.status !== "refused" && b.status === "refused")
                          return 1;
                        if (a.status === "returned" && b.status !== "returned")
                          return -1;
                        if (a.status !== "returned" && b.status === "returned")
                          return 1;
                      })
                      .filter((historyRow) => {
                        if (historyRow.status === "pending") return false;
                        return true;
                      })
                      .map((historyRow, i) => (
                        <TableRow
                          key={historyRow.date}
                          sx={{
                            height: 50,
                            bgcolor: i % 2 === 0 && "grey.50",
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{
                              fontFamily: "poppins-regular",
                            }}
                          >
                            {historyRow.id}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{
                              fontFamily: "poppins-regular",
                            }}
                          >
                            {historyRow.requester}
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              fontFamily: "poppins-regular",
                            }}
                          >
                            {moment(timeConverter(historyRow.createdAt)).format(
                              "DD.MM.YYYY HH:mm"
                            )}
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              fontFamily: "poppins-regular",
                            }}
                          >
                            {moment(timeConverter(historyRow.startDate)).format(
                              "DD.MM.YYYY"
                            )}
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              fontFamily: "poppins-regular",
                            }}
                          >
                            {moment(timeConverter(historyRow.endDate)).format(
                              "DD.MM.YYYY"
                            )}
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              fontFamily: "poppins-regular",
                            }}
                          >
                            {historyRow.status === "requested"
                              ? "Demandé"
                              : historyRow.status === "accepted"
                              ? "Accepté"
                              : historyRow.status === "refused"
                              ? "Refusé"
                              : historyRow.status === "returned"
                              ? "Rendu"
                              : historyRow.status === "pending"
                              ? "En attente"
                              : "Inconnu"}
                          </TableCell>

                          <TableCell
                            align="left"
                            sx={{
                              fontFamily: "poppins-regular",
                            }}
                          >
                            {historyRow.returnedAt &&
                            historyRow.status === "returned"
                              ? moment(
                                  timeConverter(historyRow.returnedAt)
                                ).format("DD.MM.YYYY HH:mm")
                              : historyRow.status === "accepted" &&
                                !historyRow.returnedAt
                              ? "En possession"
                              : historyRow.status === "refused" ||
                                historyRow.status === "pending"
                              ? ""
                              : "Inconnu"}
                          </TableCell>
                          {/* {edit && (
                            <TableCell align="left">
                              <IconButton
                                aria-label=""
                                sx={{
                                  width: 25,
                                  height: 25,
                                  bgcolor: "primary.main",
                                  color: "white",
                                  "&:hover": {
                                    bgcolor: "primary.dark",
                                  },
                                  marginRight: 1,
                                }}
                                onClick={() => {
                                  onEditClick(historyRow.id);
                                }}
                              >
                                <EditRoundedIcon
                                  sx={{
                                    width: 18,
                                    height: 18,
                                  }}
                                />
                              </IconButton>
                              <IconButton
                                aria-label=""
                                sx={{
                                  width: 25,
                                  height: 25,
                                  bgcolor: "error.main",
                                  color: "white",
                                  "&:hover": {
                                    bgcolor: "error.dark",
                                  },
                                }}
                              >
                                <DeleteRoundedIcon
                                  sx={{
                                    width: 20,
                                    height: 20,
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          )} */}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export const TestTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [clickedId, setClickedId] = useState();

  const toggleDrawerModify = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenModify(open);
  };

  useEffect(() => {
    (async () => {
      await axios
        .get("http://localhost:5050/inventory")
        .then(async (inventoryRes) => {
          const inventoryItems = inventoryRes.data;
          const _data = [];
          for (const item of inventoryItems) {
            try {
              const _history = await axios.get(
                `http://localhost:5050/inventory/requests/${item.id}`
              );
              const d = {device: item, history: _history.data};
              _data.push(d);
            } catch (err) {
              console.log(err);
              const d = {device: item, history: null};
              _data.push(d);
            }
          }

          setData(_data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  return (
    <>
      <SideBarModifyRequest
        open={openModify}
        toggleDrawerModify={toggleDrawerModify}
        requestId={clickedId}
      />
      {/* <Button
        variant="contained"
        color="primary"
        onClick={() => setEdit(!edit)}
      >
        {edit ? "Terminer" : "Modifier"}
      </Button> */}
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{fontFamily: "poppins-semibold"}}>
                Id matériel
              </TableCell>
              <TableCell sx={{fontFamily: "poppins-semibold"}}>
                Nom matériel
              </TableCell>
              <TableCell sx={{fontFamily: "poppins-semibold"}}>
                Réference
              </TableCell>

              <TableCell sx={{fontFamily: "poppins-semibold"}}>
                Catégorie
              </TableCell>
              <TableCell sx={{fontFamily: "poppins-semibold"}}>
                Campus
              </TableCell>
              <TableCell sx={{fontFamily: "poppins-semibold"}}>
                Statut
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Row
                key={row.id}
                row={row}
                edit={edit}
                onEditClick={(id) => {
                  setClickedId(id);
                  toggleDrawerModify(null, true);
                }}
              />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={5}
          page={0}
          onChangePage={() => {}}
          onChangeRowsPerPage={() => {}}
        />
      </TableContainer>
    </>
  );
};
