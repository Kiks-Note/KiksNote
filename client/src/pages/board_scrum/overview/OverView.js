import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardSprint from "../../../components/board_scrum/overview/CardSprint";
import StatTab from "../../../components/board_scrum/overview/StatTab";
import StoryList from "../../../components/board_scrum/overview/StoryList";
import Grid from "@mui/material/Grid";
import {w3cwebsocket} from "websocket";
import PropTypes from "prop-types";
import {setActiveTab, addTab} from "../../../redux/slices/tabBoardSlice";

OverView.propTypes = {
  id: PropTypes.string.isRequired,
};
function OverView({id}) {
  var [releases, setRelease] = useState({});
  const [stories, setStories] = useState({});
  var [boards, setBoards] = useState({});
  const [display, setDisplay] = useState(false);
  const [pdfLink, setPdfLink] = useState("");
  const dispatch = useDispatch();

  const moveToOverView = () => {
    const pdfViewTab = {
      id: "Backlog" + id,
      label: "Backlog ",
      closeable: true,
      component: "PdfView",
      data: {dashboardId: id, pdfLink: pdfLink},
    };
    dispatch(addTab(pdfViewTab));
    dispatch(setActiveTab(pdfViewTab.id));
  };

  useEffect(() => {
    (async () => {
      const wsComments = new w3cwebsocket(
        `${process.env.REACT_APP_SERVER_API_WS}/overview`
      );

      wsComments.onopen = function (e) {
        wsComments.send(JSON.stringify(id));
      };

      wsComments.onmessage = (message) => {
        var data = JSON.parse(message.data);
        setPdfLink(data.pdf_link);
        setRelease((releases = data.release));
        setBoards((boards = data.boards));
        setStories(data.stories);
        setDisplay(true);
      };
    })();
  }, []);

  return (
    <>
      <Grid container spacing={1} sx={{ml: 1}}>
        <Grid item xs={12} md={5}>
          {display ? (
            <>
              <Typography variant="h4">Stories</Typography>
              <StoryList
                stories={stories}
                sprints={releases}
                dashboardId={id}
              />
              <Typography variant="h4" gutterBottom sx={{flexGrow: 1}}>
                Release / Sprint
              </Typography>
              <List
                style={{
                  maxHeight: "40vh",
                  display: "flex",
                  borderStyle: "solid",
                  borderColor: "white",
                  borderWidth: "1px",
                  flexDirection: "column",
                  alignItems: "center",
                  overflow: "auto",
                  borderRadius: "7%",
                }}
              >
                {Object.keys(releases).map((item, i) => (
                  <ListItem key={i + id}>
                    <Box sx={{width: "100%"}}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{item}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{width: "100%"}}>
                          <Box sx={{width: "100%"}}>
                            <CardSprint
                              key={id}
                              release={releases[item]}
                              dashboardId={id}
                            />
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {display ? (
            <>
              <Box>
                {pdfLink.length != 0 ? (
                  <Button variant="contained" onClick={moveToOverView}>
                    Backlog
                  </Button>
                ) : (
                  <></>
                )}
              </Box>{" "}
              <Typography variant="h4" gutterBottom sx={{flexGrow: 1}}>
                Statistiques
              </Typography>
              <StatTab boards={boards} />{" "}
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
}
export default OverView;
