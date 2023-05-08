import { useState,useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
const schema = yup.object().shape({
  labels: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        name: yup.string().required(),
        color: yup.string().required(),
      })
    )
    .min(1, "Veuillez sélectionner au moins un label"),
});

export default function ListModal({
  showModal,
  closeModal,
  dashboardId,
  boardId,
  columnId,
  info,
  stories,
  type,
  labelList,
  label,
}) {
  const { assignedTo } = info;
  const [selectedAssignees, setSelectedAssignees] = useState(assignedTo);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    setLabels(labelList);
  }, []);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
console.log(errors);
  const onSubmit = (data) => {
    console.log(info);
    try {
      axios.put(
        "http://localhost:5050/dashboard/" +
          dashboardId +
          "/board/" +
          boardId +
          "/column/" +
          columnId +
          "/editCard",
        {
          id: info.id,
          title: info.name,
          desc: info.desc,
          storyId: info.storyId,
          color: info.color,
          assignedTo: info.assignedTo,
          labels: data.labels,
        }
      );
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };
  const handleAssigneesChange = (event) => {
    setSelectedAssignees(event.target.value);
  };
  const handleClick = (event) => {
    saveStory(event);
  };
  const saveStory = (story) => {
    try {
      axios.put(
        "http://localhost:5050/dashboard/" +
          dashboardId +
          "/board/" +
          boardId +
          "/column/" +
          columnId +
          "/editCard",
        {
          id: info.id,
          title: info.name,
          desc: info.desc,
          storyId: story.id,
          color: story.color,
          assignedTo: info.assignedTo,
          labels: info.labels,
        }
      );
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  let titleModal;
  switch (type) {
    case "stories":
      titleModal = "Liste des stories";
      break;
    case "membres":
      titleModal = "Liste des membres";
      break;
    case "labels":
      titleModal = "Choix de label";
      break;
    default:
      titleModal = "";
      break;
  }
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Card
          sx={[{ width: "30vh", maxWidth: "60%", minWidth: "fit-content" }]}
        >
          <CardHeader
            title={titleModal}
            action={
              <IconButton onClick={closeModal} size="small">
                <CloseIcon />
              </IconButton>
            }
          />
          <Box sx={{ m: 2 }}>
            {type === "stories" && (
              <List>
                {stories.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemButton
                      style={{
                        border: `2px solid ${item.color}`,
                        borderRadius: "5px",
                        backgroundColor: item.color,
                        color: "white",
                        padding: "5px 10px",
                      }}
                      onClick={() => handleClick(item)}
                    >
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
            {type === "membres" && (
              <Box>
                <h2>Membres</h2>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="assigned-to-label">Membres</InputLabel>
                  <Select
                    labelId="assigned-to-label"
                    id="assigned-to-select"
                    multiple
                    value={selectedAssignees}
                    onChange={handleAssigneesChange}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {info.assignedTo.map((assignee) => (
                      <MenuItem key={assignee} value={assignee}>
                        <ListItemText primary={assignee} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
            {type === "labels" && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Controller
                  name="labels"
                  control={control}
                  defaultValue={label}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      options={labels.filter(
                        (option) => !value.some((tag) => tag.id === option.id)
                      )}
                      getOptionLabel={(option) => option.name}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option.name}
                            {...getTagProps({ index })}
                            style={{ backgroundColor: option.color }}
                            onDelete={() => {
                              const newValues = [...value];
                              newValues.splice(index, 1);
                              onChange(newValues);
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Labels"
                          sx={{ marginBottom: 2 }}
                          error={!!errors.labels}
                          helperText={errors.labels?.message}
                        />
                      )}
                      value={value}
                      onChange={(event, newValue) => {
                        const newValues = [...value];
                        newValue.forEach((option) => {
                          if (
                            !newValues.find(
                              (valueOption) => valueOption.id === option.id
                            )
                          ) {
                            newValues.push(option);
                          }
                        });
                        onChange(newValues);
                      }}
                      noOptionsText="Toutes les options ont été sélectionnées"
                    />
                  )}
                />

                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                  Ajouter
                </Button>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}

ListModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  dashboardId: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  info: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    desc: PropTypes.string,
    assignedTo: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    labels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        color: PropTypes.string,
      })
    ),
  }).isRequired,
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
  type: PropTypes.string.isRequired,
};
