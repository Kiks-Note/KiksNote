import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';




function PreviewBlog() {
    const [data, setData] = useState(null);
    const { id } = useParams();


    useEffect(() => {
        (async () => {

            console.log(id);

            await axios.get(`http://localhost:5050/blog_event/${id}`).then((res) => {
                setData(res.data);
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
            });
        })();
    }, []);



    return (
        <div>
            {data && (

                //<h1>{data.inputEditorState}</h1>
                <div dangerouslySetInnerHTML={{ __html: data.inputEditorState }} />

            )}
        </div>
    );

}

export default PreviewBlog;