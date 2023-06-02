import {Button, Popover, Typography} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "react-hot-toast";
import GridData from "../../components/inventory/GridData";
import timeConverter from "../../functions/TimeConverter";

const InventoryIdeasNotTreated = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    loading &&
      (async () => {
        try {
          const response = await axios.get(
            `http://localhost:5050/inventory/ideas/pending`
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
          {params.value}
        </Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      editable: false,
      renderCell: (params) => (
        <>
          <Button
            aria-describedby={id}
            onClick={handleClick}
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
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography sx={{p: 2}}>{params.value}</Typography>
          </Popover>
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
      description: idea.description,
    };
  });

  return (
    <div>
      <Toaster />
      <GridData columns={columns} rows={rows} />
    </div>
  );
};

export default InventoryIdeasNotTreated;
