import React, { useEffect, useState } from 'react';

const InputNode = ({ node, sendName }) => {
  const inputRef = React.createRef();
  const [send, setSend] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      
      if (event.key === 'Enter') {
        console.log(node);
        var updateNode =  { ...node };
        updateNode.name = event.target.value;
        
        if(!send){
          var data = {newBranch: updateNode, oldBranch: node.name}
          sendName(data);
          setSend(true)
        }
        // Placez ici le code que vous souhaitez exécuter lorsque la touche Entrée est pressée
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
   console.log('r')
  };

  return (
    <div>
      <input ref={inputRef} type="text" style={{ color: 'black' }} onChange={handleInputChange}  />
    </div>
  );
};

export default InputNode;