import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

export default function ModalNotifications({ message, open = false }) {
  const [opened, setOpened] = React.useState(open);
  const [transition, setTransition] = React.useState(undefined);

  const handleClick = (Transition) => () => {
    setTransition(() => Transition);
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
  };

  return (
    <div>
      <Button onClick={handleClick(TransitionLeft)}>Right</Button>
      <Snackbar
        open={opened}
        onClose={handleClose}
        TransitionComponent={transition}
        message={message}
        key={transition ? transition.name : ""}
      />
    </div>
  );
}
