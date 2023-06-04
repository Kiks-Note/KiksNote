import { useTheme, useEffect } from "@mui/material";
import useFirebase from "../../hooks/useFirebase";
import Illu from "../../assets/img/login_img.svg";

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
        <div className="news-feed">

        </div>
        <div className="home-dashboard-items">
          <div className="home-dashboard-item">
            <img src={Illu} alt="illustration" style={{
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
            <img src={Illu} alt="illustration" style={{
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
            <img src={Illu} alt="illustration" style={{
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
            <img src={Illu} alt="illustration" style={{
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
            <img src={Illu} alt="illustration" style={{
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
            <img src={Illu} alt="illustration" style={{
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
            <img src={Illu} alt="illustration" style={{
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
        </div>
      </div>
    </div>
  );
}

export default Home;
