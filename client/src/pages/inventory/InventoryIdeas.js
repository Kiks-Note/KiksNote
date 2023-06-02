import {Button, Popover, Typography} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "react-hot-toast";
import GridData from "../../components/inventory/GridData";
import timeConverter from "../../functions/TimeConverter";
import BasicModal from "../../components/inventory/BasicModal";

const InventoryIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    loading &&
      (async () => {
        try {
          const response = await axios.get(
            `http://localhost:5050/inventory/ideas`
          );
          setIdeas(response.data);
          console.log(response.data);
          setLoading(false);
        } catch (error) {
          toast.error("Erreur lors du chargement");
          console.error(error);
        }
      })();
  }, [loading]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 130,
      editable: false,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: "poppins-regular",
            fontSize: 14,
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Nom",
      width: 150,
      editable: false,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: "poppins-regular",
            fontSize: 14,
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "createdBy",
      headerName: "Créé par",
      width: 200,
      editable: false,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: "poppins-regular",
            fontSize: 14,
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "createAt",
      headerName: "Créé le",
      width: 130,
      editable: false,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: "poppins-regular",
            fontSize: 14,
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "url",
      headerName: "URL",
      width: 150,
      editable: false,
      renderCell: (params) => (
        <Button
          sx={{
            backgroundColor: "#373737",
            fontFamily: "poppins-regular",
            fontSize: 14,
            color: "#fff",
          }}
          href={params.value}
        >
          Lien
        </Button>
      ),
    },
    {
      field: "price",
      headerName: "Prix",
      width: 100,
      editable: false,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: "poppins-regular",
            fontSize: 14,
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {params.value.toFixed(2)} €
        </Typography>
      ),
    },
    {
      field: "reason",
      headerName: "Raison",
      width: 100,
      editable: false,
      renderCell: (params) => (
        <>
          <Button
            aria-describedby={params.row.id}
            onClick={() => {
              setModalOpen(true);
              setModalText(params.value);
              setModalType("Raison");
            }}
            sx={{backgroundColor: "#373737"}}
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
        </>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 100,
      editable: false,
      renderCell: (params) => (
        <>
          <Button
            aria-describedby={params.row.id}
            onClick={() => {
              setModalOpen(true);
              setModalText(params.value);
              setModalType("Description");
            }}
            sx={{backgroundColor: "#373737"}}
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
        </>
      ),
    },
  ];
  const rows = ideas.map((idea) => {
    return {
      id: idea.id,
      name: idea.name,
      createdBy: idea.createdBy,
      createAt: moment(timeConverter(idea.createdAt)).format("DD MMM YYYY"),
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
      <GridData columns={columns} rows={rows} />
    </div>
  );
};

export default InventoryIdeas;
