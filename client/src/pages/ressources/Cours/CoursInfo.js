import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CoursInfo = () => {
  const { id } = useParams();

  const [coursData, SetCoursData] = useState([]);

  const getCoursId = async () => {
    try {
      await axios
        .get(`http://localhost:5050/ressources/cours/${id}`)
        .then((res) => {
          SetCoursData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCoursId();
  }, []);

  console.log(coursData);
};

export default CoursInfo;
