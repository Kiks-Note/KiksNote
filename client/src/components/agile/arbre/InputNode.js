import React, { useEffect, useState } from 'react';

const InputNode = ({ node, sendName }) => {
  const inputRef = React.createRef();
  const [send, setSend] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      
      if (event.key === 'Enter') {
        var updateNode =  { ...node };
        updateNode.name = event.target.value;
        if(!send){
          var data = {newBranch: updateNode, oldBranch: node.name}
          sendName(data);
          setSend(true)
        }
      }
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [ sendName]);

  const handleInputChange = (e) => {
  };

  return (
    <div>
      <input ref={inputRef} type="text" style={{ color: 'black' }} onChange={handleInputChange}  />
    </div>
  );
};

export default InputNode;
