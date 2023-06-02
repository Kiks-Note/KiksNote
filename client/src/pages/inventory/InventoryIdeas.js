import {Button, Popover, Skeleton, Typography} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "react-hot-toast";
import GridData from "../../components/inventory/GridData";
import timeConverter from "../../functions/TimeConverter";
import BasicModal from "../../components/inventory/BasicModal";
import {useParams} from "react-router-dom";

const InventoryIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalType, setModalType] = useState("");
  const params = useParams();
  console.log(params);

  useEffect(() => {
    loading &&
      (async () => {
        try {
          const response = await axios.get(
            `http://localhost:5050/inventory/ideas`
          );

          console.log(response.data);

          if (params.status === "treated") {
            setIdeas(
              response.data.filter((idea) =>
                ["accepted", "refused"].includes(idea.status)
              )
            );
          } else if (params.status === "pending") {
            setIdeas(response.data.filter((idea) => idea.status === "pending"));
          } else {
            setIdeas(
              response.data.sort((a, b) => {
                if (a.status === "pending" && b.status !== "pending") {
                  return -1; // a comes before b
                } else if (a.status !== "pending" && b.status === "pending") {
                  return 1; // a comes after b
                } else if (a.status === "accepted" && b.status === "refused") {
                  return -1; // a comes before b
                } else if (a.status === "refused" && b.status === "accepted") {
                  return 1; // a comes after b
                }
                return 0; // a and b are equal in terms of sorting
              })
            );
          }

          console.log(response.data);
          setLoading(false);
        } catch (error) {
          toast.error("Erreur lors du chargement");
          console.error(error);
        }
      })();
  }, [loading]);

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:5050/inventory/ideas/${id}/accept`);
      toast.success("Idée acceptée");
      setLoading(true);
    } catch (error) {
      toast.error("Erreur lors de l'acceptation");
      console.error(error);
    }
  };

  const handleRefuse = async (id) => {
    try {
      await axios.put(`http://localhost:5050/inventory/ideas/${id}/refuse`);
      toast.success("Idée refusée");
      setLoading(true);
    } catch (error) {
      toast.error("Erreur lors du refus");
      console.error(error);
    }
  };

  const renderCells = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Typography
            sx={{
              fontFamily: "poppins-regular",
              fontSize: 14,
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {value}
          </Typography>
        )}
      </>
    );
  };

  const renderCellUrlButton = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Button
            sx={{
              backgroundColor: "#1E4675",
              fontFamily: "poppins-regular",
              fontSize: 14,
              color: "#fff",

              "&:hover": {
                backgroundColor: "#2868B6",
              },
            }}
            href={value}
          >
            Lien
          </Button>
        )}
      </>
    );
  };

  const renderCellStatus = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Button
            sx={{
              backgroundColor:
                value === "pending"
                  ? "#ECD044"
                  : value === "accepted"
                  ? "#4FA280"
                  : "#7B0D1E",
              fontFamily: "poppins-regular",
              fontSize: 14,
              color:
                value === "pending"
                  ? "#ECD044"
                  : value === "accepted"
                  ? "#4FA280"
                  : "#7B0D1E",
              maxWidth: 50,
              height: 30,

              "&:hover": {
                backgroundColor:
                  value === "pending"
                    ? "#ECD044"
                    : value === "accepted"
                    ? "#4FA280"
                    : "#7B0D1E",
              },
            }}
          ></Button>
        )}
      </>
    );
  };

  const renderCellReason = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Button
            aria-describedby={value}
            onClick={() => {
              setModalOpen(true);
              setModalText(value);
              setModalType("Raison");
            }}
            sx={{
              backgroundColor: "#1E4675",
              "&:hover": {
                backgroundColor: "#2868B6",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 14,
                textOverflow: "ellipsis",
                overflow: "hidden",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Voir
            </Typography>
          </Button>
        )}
      </>
    );
  };

  const renderCellDescription = (value, skeletonWidth = 100) => {
    return (
      <>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{width: skeletonWidth}}
          />
        ) : (
          <Button
            aria-describedby={value}
            onClick={() => {
              setModalOpen(true);
              setModalText(value);
              setModalType("Description");
            }}
            sx={{
              backgroundColor: "#1E4675",
              "&:hover": {
                backgroundColor: "#2868B6",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 14,
                textOverflow: "ellipsis",
                overflow: "hidden",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Voir
            </Typography>
          </Button>
        )}
      </>
    );
  };

  const renderCellAction = (value, skeletonWidth) => {
    return (
      <>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Skeleton
              animation="wave"
              variant="rounded"
              sx={{width: skeletonWidth}}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              sx={{width: skeletonWidth}}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#4FA280",
                fontFamily: "poppins-regular",
                fontSize: 14,
                color: "#fff",

                "&:hover": {
                  backgroundColor: "#1EA36C",
                },
              }}
              onClick={() => handleAccept(value)}
            >
              Accepter
            </Button>
            <Button
              sx={{
                backgroundColor: "#7B0D1E",
                fontFamily: "poppins-regular",
                fontSize: 14,
                color: "#fff",

                "&:hover": {
                  backgroundColor: "#B00E1E",
                },
              }}
              onClick={() => handleRefuse(value)}
            >
              Refuser
            </Button>
          </div>
        )}
      </>
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 130,
      editable: false,
      renderCell: (params) => renderCells(params.value, 100),
    },
    {
      field: "name",
      headerName: "Nom",
      width: 150,
      editable: false,
      renderCell: (params) => renderCells(params.value, 150),
    },
    {
      field: "createdBy",
      headerName: "Créé par",
      width: 200,
      editable: false,
      renderCell: (params) => renderCells(params.value, 200),
    },
    {
      field: "createAt",
      headerName: "Créé le",
      width: 130,
      editable: false,
      renderCell: (params) => renderCells(params.value, 130),
    },
    {
      field: "status",
      headerName: "Statut",
      width: 125,
      editable: false,
      hide: params.status !== undefined,
      renderCell: (params) => renderCellStatus(params.value, 125),
    },
    {
      field: "url",
      headerName: "URL",
      width: 125,
      editable: false,
      renderCell: (params) => renderCellUrlButton(params.value, 125),
    },
    {
      field: "price",
      headerName: "Prix",
      width: 125,
      editable: false,
      renderCell: (params) => renderCells(params.value.toFixed(2) + " €", 125),
    },
    {
      field: "reason",
      headerName: "Raison",
      width: 125,
      editable: false,
      renderCell: (params) => renderCellReason(params.value, 125),
    },
    {
      field: "description",
      headerName: "Description",
      width: 125,
      editable: false,
      renderCell: (params) => renderCellDescription(params.value, 125),
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      editable: false,
      hide: params.status !== "pending",
      renderCell: (params) => renderCellAction(params.row.id, 80),
    },
  ];
  const rows = ideas.map((idea) => {
    return {
      id: idea.id,
      name: idea.name,
      createdBy: idea.createdBy,
      createAt: moment(timeConverter(idea.createdAt)).format("DD MMM YYYY"),
      status: idea.status,
      url: idea.url,
      price: idea.price,
      reason: idea.reason,
      description: idea.description,
    };
  });

  return (
    <div>
      <Toaster />
      <BasicModal
        open={modalOpen}
        setOpen={setModalOpen}
        text={modalText}
        type={modalType}
      />

      {params.status === undefined && (
        <div
          style={{
            display: "flex",
            gap: "50px",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#ECD044",
                width: "75px",
                height: "30px",
                borderRadius: "5px",
              }}
            />
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 16,
                marginTop: "5px",
              }}
            >
              En attente
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#4FA280",
                width: "75px",
                height: "30px",
                borderRadius: "5px",
              }}
            />
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 16,
                marginTop: "5px",
              }}
            >
              Acceptée
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#7B0D1E",
                width: "75px",
                height: "30px",
                borderRadius: "5px",
              }}
            />
            <Typography
              sx={{
                fontFamily: "poppins-regular",
                fontSize: 16,
                marginTop: "5px",
              }}
            >
              Refusée
            </Typography>
          </div>
        </div>
      )}

      <GridData columns={columns} rows={rows} />
    </div>
  );
};

export default InventoryIdeas;
