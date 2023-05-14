import {Container, Grid, Typography} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import timeConverter from "../../functions/TimeConverter";

const ImageView = styled.img`
  width: 60%;
  height: 25%;
  object-fit: cover;
  border-radius: 10px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50%;
  margin: 0.5rem 0;
`;

const Text = styled(Typography)`
  font-family: "poppins-regular";
  font-size: 1.15rem;
  color: #fff;
`;

const Title = styled(Typography)`
  font-family: "poppins-semiBold";
  font-size: 1.5rem;
  color: #ffff;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const Containers = styled(Container)`
    display: "flex",
    align-items: "center",
    flex-direction: "column",
    justify-content: "center",
    width: "100%",
    padding-block: "2rem",
`;

const DeviceHistory = () => {
  const [deviceHistory, setDeviceHistory] = useState([]);
  const [device, setDevice] = useState({});
  const [loading, setLoading] = useState(true);
  const {deviceId} = useParams();

  useEffect(() => {
    (async () => {
      const {data} = await axios.get(
        `http://localhost:5050/inventory/device/${deviceId}`
      );
      console.log(data);
      setDevice(data);
      setLoading(false);
    })();
  }, [deviceId]);

  return (
    <Container
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Containers
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          paddingBlock: "2rem",
        }}
      >
        {!loading && (
          <>
            <ImageView src={device.image} alt={device.label} />
            <Title variant="h5">{device.label}</Title>
            <Item>
              <Text variant="h6">Catégorie: </Text>
              <Text variant="h6">{device.category}</Text>
            </Item>
            <Item>
              <Text variant="h6">Etat: </Text>
              <Text variant="h6">
                {device.condition === "new" ? "Neuf" : "Occasion"}
              </Text>
            </Item>
            <Item>
              <Text variant="h6">Date d'ajout: </Text>
              <Text variant="h6">
                {moment(timeConverter(device.createdAt)).format("DD.MM.YYYY")}
              </Text>
            </Item>
            <Item>
              <Text variant="h6">Reference: </Text>
              <Text variant="h6">{device.reference}</Text>
            </Item>
            <Item>
              <Text variant="h6">Prix: </Text>
              <Text variant="h6">{parseInt(device.price).toFixed(2)} €</Text>
            </Item>
            <Item>
              <Text variant="h6">Statut: </Text>
              <Text variant="h6">
                {device.status === "available" ? "Disponible" : "Indisponible"}
              </Text>
            </Item>
            <Item>
              <Text variant="h6">Storage: </Text>
              <Text variant="h6">{device.storage}</Text>
            </Item>
          </>
        )}
      </Containers>
      <Containers></Containers>
    </Container>
  );
};

export default DeviceHistory;
