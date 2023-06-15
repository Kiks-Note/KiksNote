import {
    Skeleton,
    Typography,
    Card,
    Button,
} from "@mui/material";

const SkeletonJpoInfo = (props) => {
    return (
        <>
<div className="jpo-details-container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Skeleton width={800} height={500} variant="rectangular" />
            </div>
            <div className="head-jpo-container">
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", paddingLeft: "5%" }}
              >
                <Skeleton width={200} />
              </Typography>
              <Typography sx={{ paddingRight: "5%" }}>
                <Skeleton width={150} />
              </Typography>
            </div>
            <div className="jpoinfo-sections">
              <section className="jpo-left-side-section">
                <Typography variant="body1" sx={{ color: "lightgray" }}>
                  <Skeleton count={4} />
                </Typography>
                <div className="list-students-project-linked">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      padding: "10px",
                    }}
                  >
                    Liste des projets étudiants présentés lors de cette jpo :
                  </Typography>

                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card
                      key={index}
                      sx={{
                        padding: "10px 0px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "80%",
                        marginBottom: "10px",
                      }}
                    >
                      <div className="img-name-project-link-jpo-page">
                        <Skeleton
                          width={70}
                          height={30}
                          variant="rectangular"
                        />
                        <Typography fontWeight={"bold"} paddingLeft={"10px"}>
                          <Skeleton width={150} />
                        </Typography>
                      </div>
                      <div className="button-project">
                        <Button className={props.classes.btnProject}>
                          <Skeleton width={150} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
              <section className="jpo-right-side-section">
                <Typography sx={{ fontWeight: "bold", padding: "10px" }}>
                  Plaquette Commerciale JPO
                </Typography>
                <Skeleton width={500} height={800} variant="rectangular" />
                <Button
                  sx={{ marginTop: "30px", marginBottom: "30px" }}
                  className={props.classes.btnLinkProject}
                >
                  <Skeleton width={100} />
                </Button>
              </section>
            </div>
          </div>
          </>
          );
      };
      
      export default SkeletonJpoInfo;