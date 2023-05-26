import { Dialog } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const CallModal = (props) => {
  const [calls, setCalls] = useState([]);
  const generated = useRef(false);

  useEffect(() => {
    if (!generated.current) {
      getCalls();
    }
  }, []);
  const getCalls = async () => {
    const response = await axios.get(
      "http://localhost:5050/call/getCallsByLessonId",
      { params: { id: props.lessonId } }
    );
    setCalls(response.data);
  };
  return <Dialog>{calls.map((call) => {})}</Dialog>;
};
