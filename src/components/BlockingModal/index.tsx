import BasicModal from "components/MaterailModal";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BlockingModal = ({ when, message, navigate }: any) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (when) {
      console.log("hey i am here hidden");
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [when]);

  const handleConfirm = () => {
    navigate(true);
    setShowModal(false);
  };

  const handleCancel = () => {
    navigate(false);
    setShowModal(false);
  };

  return (
    <>
      <BasicModal openModal={showModal} onClose={handleCancel}>
        <p>{message}</p>
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={handleCancel}>Cancel</button>
      </BasicModal>
    </>
  );
};
export default BlockingModal;
