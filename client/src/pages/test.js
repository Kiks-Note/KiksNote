import React, { useState } from "react";
import Button from "./button_test";
import Modal from "./modal_test";

const ButtonWithModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button handleClick={handleButtonClick} />
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
};

export default ButtonWithModal;
