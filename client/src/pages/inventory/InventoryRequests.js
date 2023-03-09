import {Box, Grid, Typography} from "@mui/material";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import {Rings} from "react-loader-spinner";
import InvBox from "../../components/inventory/InvBox";

export const InventoryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await axios
        .get("http://localhost:5050/inventory")
        .then((res) => {
          setRequests(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  const handleAcceptRequest = async (deviceId, requestId) => {
    await axios
      .put(
        `http://localhost:5050/inventory/acceptrequest/${deviceId}/${requestId}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRefuseRequest = async (deviceId, requestId) => {
    toast.promise(
      axios.put(
        `http://localhost:5050/inventory/refuserequest/${deviceId}/${requestId}`
      ),
      {
        loading: "Refus de la demande...",
        success: "Demande refusée",
        error: "Erreur lors du refus de la demande",
      }
    );
  };

  return (
    <div>
      <Typography variant="h5" sx={{marginBottom: 2}}>
        Demandes de matériel
      </Typography>
      <Toaster position="bottom-left" />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Rings
            height="200"
            width="200"
            color="#00BFFF"
            radius="6"
            wrapperStyle={{}}
            wrapperClass="loader"
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
        <Box sx={{flexGrow: 1}}>
          <Grid container spacing={4}>
            {requests
              .filter((item) => item.status === "requested")
              .map((item, index) => (
                <Grid item key={index}>
                  <InvBox
                    image={item.image}
                    label={item.label}
                    reference={item.ref}
                    category={item.category}
                    campus={item.campus}
                    status={item.status}
                    request={true}
                    acceptRequest={() => {
                      handleAcceptRequest(item.id, item.lastRequestId);
                      toast.success(
                        "Vous avez accepté la demande " + item.lastRequestId
                      );
                    }}
                    refuseRequest={() => {
                      handleRefuseRequest(item.id, item.lastRequestId);
                    }}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
      )}
    </div>
  );
};
