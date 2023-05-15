import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
} from "@mui/material";
import { EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

function PreviewBlog() {
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      console.log(id);

      await axios
        .get(`http://localhost:5050/blog/${id}`)
        .then((res) => {
          setData(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          window.history.back();
        }}
      >
        Retour à la page de blog{" "}
      </Button>
      {data && (
        <Card>
          <CardHeader title={data.title} />
          <CardMedia
            component="img"
            src={data.photo}
            alt={data.title}
            sx={{ width: 300, height: 200 }}
          />
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: data.inputEditorState }} />
          </CardContent>
        </Card>
      )}
      <br />
    </div>
  );
}

export default PreviewBlog;
