import React, { useState } from "react";

const Modal = ({ closeModal }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      sendMessage(inputValue, "user");
      setInputValue("");
    }
  };

  const sendMessage = (message, sender) => {
    const newMessage = { message, sender };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>ChatBot</h2>
        <div className="chat-log">
          {messages.map((message, index) => (
            <div className={`message ${message.sender}`} key={index}>
              {message.message}
            </div>
          ))}
        </div>
        <form onSubmit={handleFormSubmit}>
          <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Type a message..." />
          <button type="submit">Send</button>
        </form>
        <button className="close-button" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
