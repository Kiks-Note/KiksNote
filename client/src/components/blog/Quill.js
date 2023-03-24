import React, { useState } from 'react';
import { useQuill } from 'react-quill';
import 'quill/dist/quill.snow.css';

function Quill() {
    const { quill, quillRef } = useQuill();
    const [value, setValue] = useState();


    React.useEffect(() => {
        if (quill) {
            quill.on('text-change', () => {
                setValue(quillRef.current.firstChild.innerHTML);
            });
        }
    }, [quill]);

    console.log(value, "this is the value");



    return (
        <div>
            <div style={{ width: 500, height: 500 }}>
                <div ref={quillRef} />
            </div>
        </div>
    );
}


export default Quill;