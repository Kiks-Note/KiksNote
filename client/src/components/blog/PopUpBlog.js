import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import PreviewIcon from "@mui/icons-material/Preview";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function PopUpBlog(props) {
  const [open, setOpen] = useState(false);
  const [participantDetail, setParticipantDetail] = useState([]);
  useEffect(() => {
    console.log(props.participants);
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5050/blog/participant",
          {
            userIds: props.participants,
          }
        );
        console.log(response.data);
        setParticipantDetail(response.data);

        // Faire quelque chose avec les userDetails récupérés
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserDetails();
  }, []);

  

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        {" "}
        <PreviewIcon/>
        
      </IconButton>
      <BootstrapDialog
      
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Liste des participants
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {participantDetail &&
            participantDetail.map((participant) => (
              <div
                key={participant.id}
                style={{ display: "flex", alignItems: "center" }}
              >
                {participant.image && (
                  <Avatar src={participant.image} alt={participant.firstname} />
                )}
                <Typography gutterBottom style={{ marginLeft: "10px" }}>
                  {participant.firstname} {participant.lastname}
                </Typography>
              </div>
            ))}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
