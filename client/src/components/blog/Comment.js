import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import DisplayComment from "./DisplayComment";
import CreateComment from "./CreateComment";
import {w3cwebsocket} from "websocket";
import TutoSkeleton from "./TutoSkeleton";

export default function Comment({tutoId}) {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [allComments, setAllComments] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  // console.log(tutoId);

  useEffect(() => {
    open &&
      (async () => {
        const wsComments = new w3cwebsocket(
          `${process.env.REACT_APP_SERVER_API_WS}/tutos/comments`
        );

        wsComments.onopen = function (e) {
          console.log("[open] Connection established");
          console.log("Sending to server");
          console.log("tutoId", tutoId);
          wsComments.send(JSON.stringify(tutoId));
        };
        wsComments.onmessage = (message) => {
          const dataFromServer = JSON.parse(message.data);
          console.log("[message] Data received from server:", dataFromServer);
          setAllComments(dataFromServer);
          setIsLoading(false);
        };
      })();
  }, [open === true]);

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      // getComments();
      const {current: descriptionElement} = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Button onClick={handleClickOpen("paper")}>Commentaires</Button>
      {/*<Button onClick={handleClickOpen('body')}>scroll=body</Button>*/}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        fullWidth={true}
        maxWidth={"md"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Commentaires</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {!isloading
              ? allComments.map((comment) => (
                  <DisplayComment comment={comment} />
                ))
              : Array.from(new Array(9)).map(() => <TutoSkeleton />)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CreateComment tutoId={tutoId} />
          <Button variant="outlined" onClick={handleClose}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
