import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Presence() {
  const { id } = useParams();
  const ip = process.env.REACT_APP_IP;
  const dataFetchedRef = useRef(false);
  // const ws = new WebSocket(`ws://${ip}:5050`);
  const tempCall = useRef();
  const userID = localStorage.getItem("user_uid");
  const navigate = useNavigate();

  useEffect(() => {
    if (dataFetchedRef.current) {
      return;
    }
    dataFetchedRef.current = true;
    getCall();
  });

  const updateCall = async () => {
    const res = await axios
      .post(`http://${ip}:5050/updatecall`, {
        id: id,
        object: tempCall.current,
      })
      .then((res) => {
        console.log(res);
      });
    navigate("/appel");
  };

  const getCall = () => {
    console.log(id);
    axios
      .get(`http://${ip}:5050/getcall`, { params: { id: id } })
      .then((res) => {
        console.log(res.data);
        tempCall.current = res.data;
        getUsers();
      });
  };
  const getUsers = () => {
    console.log(userID);
    axios
      .get(`http://${ip}:5050/user`, { params: { id: userID } })
      .then((res) => {
        const scanEleveCopy = [...tempCall.current.student_scan];
        const userItem = {
          firstname: res.data.firstname,
          id: res.data.id,
        };
        if (
          scanEleveCopy.some(
            (element) => element.firstname === userItem.firstname
          )
        ) {
          navigate("/appel");
        } else {
          scanEleveCopy.push(userItem);
        }

        tempCall.current.student_scan = scanEleveCopy;
        updateCall();
      });
  };
}

export default Presence;
