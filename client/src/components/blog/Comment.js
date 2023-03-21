import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import DisplayComment from "./DisplayComment";
import CreateComment from "./CreateComment";

export default function Comment({ tutoId }) {
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const [allComments, setAllComments] = useState([]);
    // console.log(tutoId);

    const getComments = async () => {
        const response = await axios.get(`http://localhost:5050/tuto/${tutoId}/comments`);
        setAllComments(response.data);
        // console.log(response.data);
    }

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
            getComments();
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Button onClick={handleClickOpen('paper')}>Commentaires</Button>
            {/*<Button onClick={handleClickOpen('body')}>scroll=body</Button>*/}
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                fullWidth={true}
                maxWidth={'md'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Commentaires</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        {allComments.map((comment) => (
                            <DisplayComment comment={comment} />
                        ))}

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <CreateComment tutoId={tutoId} />
                    <Button variant="outlined" onClick={handleClose}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}