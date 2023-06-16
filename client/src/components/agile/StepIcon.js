import LocationCityIcon from "@mui/icons-material/LocationCity";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import WorkIcon from "@mui/icons-material/Work";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { styled } from "@mui/material/styles";
export default function StepIcon(props) {
  const { active, completed, className } = props;

  const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundColor: "rgba(34,193,195,1)",
    }),
    ...(ownerState.completed && {
      backgroundImage:
        "linear-gradient(9deg, rgba(82,253,45,1) 80%,  rgba(34,193,195,1) 100%)",
    }),
  }));
  const icons = {
    1: <GroupAddIcon />,
    2: <LocationCityIcon />,
    3: <WorkIcon />,
    4: <ConnectWithoutContactIcon />,
    5: <SportsEsportsIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}
