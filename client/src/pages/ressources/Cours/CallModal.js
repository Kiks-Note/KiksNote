import {
  Dialog,
  Box,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";
import { w3cwebsocket } from "websocket";
import useFirebase from "../../../hooks/useFirebase";

const CallModal = ({ classId, open, handleClose, lessonId }) => {
  const [calls, setCalls] = useState([]);
  let navigate = useNavigate();
  const ip = "localhost";
  const qrcode = useRef("");

  const user = useFirebase();

  const ws = useMemo(() => {
    return new w3cwebsocket(`ws://localhost:5050`);
  }, []);

  const createCall = useCallback(async () => {
    const date = new Date();
    const response = await axios.post("http://localhost:5050/call/callAdd", {
      params: {
        id_lesson: lessonId,
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

    const message = {
      type: "createRoom",
      data: {
        po_id: user?.id,
        userID: user?.id,
        class: user?.class,
        type: "call",
      },
    };
    ws.send(JSON.stringify(message));
    navigate("/appel/" + response.data.id);
  }, [lessonId, navigate, user?.class, user?.id, ws]);
  useEffect(() => {

    const getCalls = async () => {
      const response = await axios.get(
        "http://localhost:5050/call/getCallsByLessonId/" + lessonId
      );
      console.log(response);
      setCalls(response.data);
    };

    if (open) {
      getCalls();
    }
  }, [createCall, lessonId, navigate, open]);


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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          {calls.length === 0 ? (
            <Typography>Aucun appel n'a été fait pour le moment</Typography>
          ) : (
            calls.map((call) => {
              let date = new Date(Date.parse(call.date));
              return (
                <Box sx={{ display: "flex" }} key={call.id}>
                  <Typography>
                    Appel du {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {calls.length === 0 ? (
          <Button onClick={createCall}>Créer un Appel</Button>
        ) : (
          <Button onClick={createCall}>Rejoindre un appel</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CallModal;
