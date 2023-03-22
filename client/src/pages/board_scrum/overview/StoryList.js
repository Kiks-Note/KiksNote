import React, { useState, useEffect, useRef } from "react";
import TablePagination from "@mui/material/TablePagination";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";

function TextList({ stories, sprints }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [story, setStory] = useState(stories);
  const [page, setPage] = React.useState(0);
  const [storyPerPage, setStoryPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [sprint, setSprint] = useState(sprints);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeStoryPerPage = (event) => {
    setStoryPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event) => {
    setExpanded(false);
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div
        style={{
          minHeight: "70vh",
          maxHeight: "75vh",
          display: "flex",
          borderStyle: "solid",
          borderColor: "white",
          borderWidth: "1px",
          flexDirection: "column",
          alignItems: "center",
          overflow: "auto",
          borderRadius: "5%",
          marginLeft: "5%",
          marginTop: "3%",
        }}
      >
        <div
          style={{
            height: "fit-content",
            width: "fit-content",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "80%" }}>
            {story
              .slice(page * storyPerPage, page * storyPerPage + storyPerPage)
              .map((items, index) => (
                <div key={index} style={{ marginBottom: "2vh" }}>
                  <Accordion
                    expanded={expanded === index}
                    onChange={handleChange(index)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: "90%", flexShrink: 0 }}>
                        {items.name}{" "}
                        <IconButton
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={handleMenuOpen}
                        >
                          <MoreVertIcon />
                        </IconButton>{" "}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{items.desc}</Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <Typography variant="subtitle1" color="textSecondary">
                      Ajouter à un sprint
                    </Typography>

                    <Typography variant="subtitle1" color="textSecondary">
                      Nom de la release 1
                    </Typography>
                    {sprint.map((item, index) => (
                      <MenuItem key={index} onClick={handleMenuClose}>
                        {item.sprint_name}
                      </MenuItem>
                    ))}
                    <Typography variant="subtitle1" color="textSecondary">
                      Nom de la release 2
                    </Typography>
                    {sprint.map((item, index) => (
                      <MenuItem key={index} onClick={handleMenuClose}>
                        {item.sprint_name}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Box sx={{ width: "fit-content", marginLeft: "4%" }}>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 15]}
          count={story.length}
          rowsPerPage={storyPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeStoryPerPage}
          labelRowsPerPage="Par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from} - ${to} sur ${count}`
          }
        />
      </Box>
    </div>
  );
}

export default TextList;
