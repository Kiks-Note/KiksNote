import {
  Skeleton,
  Typography,
  Card,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";

import ExpandMore from "@mui/icons-material/ExpandMore";
import CreateIcon from "@mui/icons-material/Create";
import HistoryIcon from "@mui/icons-material/History";

const SkeletonJpo = (props) => {
  return (
    <>
      <div className="jpo-page">
        <div className="header-jpo">
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            Jpo
          </Typography>
          <div>
            <Button
              variant="contained"
              className={props.classes.btnCreateJpo}
              disableElevation
            >
              Créer une JPO <CreateIcon />
            </Button>
          </div>
        </div>

        <div className="jpo-list-container">
          <div className="btn-history-container">
            <Button
              variant="contained"
              disableElevation
              className={props.classes.btnHistory}
            >
              Historique <HistoryIcon />
            </Button>
          </div>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="jpo-card"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                width: "70%",
                margin: "30px",
              }}
            >
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Skeleton width={400} height={400} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className="jpo-text">
                    <Typography
                      sx={{ paddingBottom: "10px", fontSize: "24px" }}
                    >
                      <Skeleton width={200} />
                    </Typography>
                    <Typography sx={{ paddingBottom: "10px" }}>
                      <Skeleton count={4} />
                    </Typography>
                    <Typography sx={{ textAlign: "center" }}>
                      <Skeleton width={150} />
                    </Typography>
                    <List>
                      <ListItem button>
                        <ListItemText
                          primary={<Skeleton width={150} />}
                          style={{ textAlign: "center" }}
                        />
                        <ExpandMore />
                      </ListItem>
                      <Collapse timeout="auto" unmountOnExit>
                        <List disablePadding>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <ListItem
                              key={index}
                              sx={{
                                padding: "10px 0px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                borderTop: "1px solid grey",
                              }}
                            >
                              <Typography>
                                <Skeleton width={100} />
                              </Typography>
                              <Button>
                                <Skeleton width={100} />
                              </Button>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </List>
                    <div className="btn-details-jpo-container">
                      <Button className={props.classes.btnDetailJpo}>
                        <Skeleton width={100} />
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default SkeletonJpo;
