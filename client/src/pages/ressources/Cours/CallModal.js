import {
  Dialog,
  Modal,
  Box,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";
import useFirebase from "../../../hooks/useFirebase";
import { w3cwebsocket } from "websocket";

const CallModal = (props) => {
  const [calls, setCalls] = useState([]);
  let navigate = useNavigate();
  const ip = process.env.REACT_APP_IP;
  const qrcode = useRef("");
  const { user } = useFirebase();

  const ws = useMemo(() => {
    return new w3cwebsocket(`ws://${ip}:5050/callws`);
  });

  useEffect(() => {
    if (props.open) {
      getCalls();
    }
  }, [props.open]);

  const getCalls = async () => {
    const response = await axios.get(
      "http://localhost:5050/call/getCallsByLessonId/" + props.lessonId
    );
    console.log(response);
    setCalls(response.data);
    if (response.data.length <= 0) {
      createCall();
    }
  };
  const GenerateQrcode = (callId) => {
    QRCode.toDataURL(
      `http://${ip}:3000/Presence/${callId}`,
      {
        width: 800,
        margin: 2,
      },
      (err, url) => {
        if (err) return console.log(err);
        qrcode.current = url;
      }
    );
  };

  const createCall = async () => {
    const date = new Date();
    const response = await axios.post("http://localhost:5050/call/callAdd", {
      params: {
        id_lesson: props.lessonId,
        date: date,
        status: "new",
        qrcode: "",
        students_scan: [],
        chats: [],
      },
    });
    let call = response.data;
    GenerateQrcode(response.data.id);
    call["qrcode"] = qrcode.current;
    await axios.put(`http://localhost:5050/call/updatecall`, {
      params: {
        id: response.data.id,
        object: call,
      },
    });
    const res = await axios.get(
      `http://localhost:5050/ressources/class/` + props.class
    );
    console.log(res.data.data.name);
    const message = {
      type: "createRoom",
      data: {
        po_id: user?.id,
        userID: user?.id,
        class: res.data.data.name,
        appel: call,
      },
    };
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      ws.onopen = ws.send(JSON.stringify(message));
    }
    navigate("/appel/" + response.data.id);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleclose}
      maxWidth={"md"}
      fullWidth
    >
      <DialogTitle>Liste des appels</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            height: "60vh",
          }}
        >
          {calls.map((call) => {
            let date = new Date(Date.parse(call.date));
            return (
              <Box sx={{ display: "flex" }}>
                <Typography>
                  Appel du {date.getDate()}/{date.getMonth()}/
                  {date.getFullYear()}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={createCall}>Nouvel appel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallModal;
