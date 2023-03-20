import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useState} from "react";

export default function CreateComment() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen} sx={{marginRight: 1}}>
                Ajouter un commentaire
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
                <DialogTitle>Nouveau commentaire</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Partagez votre avis sur ce tutoriel
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleClose}>Publier</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}