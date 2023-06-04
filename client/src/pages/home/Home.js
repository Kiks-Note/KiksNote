import { useTheme } from "@mui/material";
import useFirebase from "../../hooks/useFirebase";
import Call from "../../assets/img/call.svg";
import Groups from "../../assets/img/groups.svg";
import Class from "../../assets/img/class.svg";
import Blog from "../../assets/img/blog.svg";
import Boards from "../../assets/img/boards.svg";
import Retro from "../../assets/img/retro.svg";
import Calendar from "../../assets/img/calendar.svg";
import Agile from "../../assets/img/agile.svg";

import "./Home.scss";

function Home() {
  const { user } = useFirebase();
  const theme = useTheme();

  return (
    <div className="home">
      <p
        style={{
          color: theme.palette.text.primary,
          fontSize: "30px",
          fontFamily: "poppins-bold",
          margin: "10px",
        }}
      >
        Bonjour, {user.firstname}
      </p>
      <div className="home-dashboard">
        <div className="news-feed" style={{
          backgroundColor: theme.palette.background.container
        }}>
          <div className="news-feed-header" style={{
            backgroundColor: theme.palette.background.element,
            padding: "10px",
          }}>
            <p style={{
              fontWeight: "bold",
              fontSize: "20px",
              fontFamily: "poppins-bold",
              color: "white",
              marginLeft: "10px",
            }}>
              Votre Feed
            </p>
          </div>
        </div>
        <div className="home-dashboard-items">
          <div className="home-dashboard-item">
            <img src={Class} alt="illustration" style={{
              backgroundColor: theme.palette.custom.button
            }} />
            <div className="home-dashboard-item-content" style={{
              backgroundColor: theme.palette.background.container
            }}>
              <p style={{
                color: theme.palette.text.primary
              }}>Cours</p>
            </div>
          </div>
          <div className="home-dashboard-item">
            <img src={Calendar} alt="illustration" style={{
              backgroundColor: theme.palette.custom.button
            }} />
            <div className="home-dashboard-item-content" style={{
              backgroundColor: theme.palette.background.container
            }}>
              <p style={{
                color: theme.palette.text.primary
              }}>Calendrier</p>
            </div>
          </div>
          <div className="home-dashboard-item">
            <img src={Boards} alt="illustration" style={{
              backgroundColor: theme.palette.custom.button
            }} />
            <div className="home-dashboard-item-content" style={{
              backgroundColor: theme.palette.background.container
            }}>
              <p style={{
                color: theme.palette.text.primary
              }}>Boards</p>
            </div>
          </div>
          <div className="home-dashboard-item">
            <img src={Call} alt="illustration" style={{
              backgroundColor: theme.palette.custom.button
            }} />
            <div className="home-dashboard-item-content" style={{
              backgroundColor: theme.palette.background.container
            }}>
              <p style={{
                color: theme.palette.text.primary
              }}>Appel</p>
            </div>
          </div>
          <div className="home-dashboard-item">
            <img src={Retro} alt="illustration" style={{
              backgroundColor: theme.palette.custom.button
            }} />
            <div className="home-dashboard-item-content" style={{
              backgroundColor: theme.palette.background.container
            }}>
              <p style={{
                color: theme.palette.text.primary
              }}>Retrospective</p>
            </div>
          </div>
          <div className="home-dashboard-item">
            <img src={Agile} alt="illustration" style={{
              backgroundColor: theme.palette.custom.button
            }} />
            <div className="home-dashboard-item-content" style={{
              backgroundColor: theme.palette.background.container
            }}>
              <p style={{
                color: theme.palette.text.primary
              }}>Analyse Agile</p>
            </div>
          </div>
          <div className="home-dashboard-item">
            <img src={Groups} alt="illustration" style={{
              backgroundColor: theme.palette.custom.button
            }} />
            <div className="home-dashboard-item-content" style={{
              backgroundColor: theme.palette.background.container
            }}>
              <p style={{
                color: theme.palette.text.primary
              }}>Groupes</p>
            </div>
          </div>
          <div className="home-dashboard-item">
            <img src={Blog} alt="illustration" style={{
              backgroundColor: theme.palette.custom.button
            }} />
            <div className="home-dashboard-item-content" style={{
              backgroundColor: theme.palette.background.container
            }}>
              <p style={{
                color: theme.palette.text.primary
              }}>Blog</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
