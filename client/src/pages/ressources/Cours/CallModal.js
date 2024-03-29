import {
  Dialog,
  Box,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";
import { w3cwebsocket } from "websocket";

const CallModal = ({
  classId,
  open,
  handleClose,
  lessonId,
  user,
  className,
}) => {
  const [calls, setCalls] = useState([]);
  let navigate = useNavigate();
  const ip = process.env.REACT_APP_IP;
  const qrcode = useRef("");

  const createWebSocket = useCallback(() => {
    const websocket = new w3cwebsocket(`ws://localhost:5050/callws`);
    return websocket;
  }, []);

  const ws = useMemo(() => createWebSocket(), [createWebSocket]);

  const createCall = useCallback(async () => {
    const GenerateQrcode = (callId) => {
      console.log(ip);
      QRCode.toDataURL(
        `http://localhost:3000/Presence/${callId}`,
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

    const date = new Date();
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_API}/call/callAdd`,
      {
        id_lesson: lessonId,
        date: date,
        status: "new",
        qrcode: "",
        students_scan: [],
        chats: [],
      }
    );
    const call = response.data;
    GenerateQrcode(response.data.id);
    call.qrcode = qrcode.current;
    await axios.put(`${process.env.REACT_APP_SERVER_API}/call/updatecall`, {
      id: response.data.id,
      object: call,
    });

    const message = {
      type: "createRoom",
      data: {
        po_id: user.id,
        userID: user.id,
        class: className,
        type: "call",
        appel: call,
        name: user.firstname,
        callId: response.data.id,
      },
    };
    ws.send(JSON.stringify(message));

    navigate("/appel/" + response.data.id);
  }, [className, ip, lessonId, navigate, user.firstname, user.id, ws]);

  useEffect(() => {
    const getCalls = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/call/getCallsByLessonId/` +
          lessonId
      );
      setCalls(response.data);
    };

    const handleWebSocketOpen = () => {
      getCalls();
    };

    if (ws.readyState === WebSocket.OPEN) {
      handleWebSocketOpen();
    } else {
      ws.onopen = handleWebSocketOpen;
    }
  }, [lessonId, ws]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"md"} fullWidth>
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
                    Appel du {date.getDate()}/{date.getMonth()}/
                    {date.getFullYear()}
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
