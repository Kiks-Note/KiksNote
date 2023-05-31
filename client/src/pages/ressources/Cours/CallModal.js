import { Dialog } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CallModal = (props) => {
  const [calls, setCalls] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    console.log(props.open);
    if (props.open) {
      getCalls();
    }
  }, [props.open]);
  const getCalls = async () => {
    const response = await axios.get("http://localhost:5050/call/calls");
    console.log(response);
    setCalls(response.data);
    if (response.data.length <= 0) {
      createCall();
    }
  };

  const createCall = async () => {
    const date = new Date();

    const response = await axios.post("http://localhost:5050/call/callAdd", {
      params: { id_lesson: props.lessonId, date: date, status: "new" },
    });
    navigate("call/" + response.data);
  };
  return <Dialog open={props.open}>{calls.map((call) => {})}</Dialog>;
};

export default CallModal;
