import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style: any = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#fff',
  border: '2px solid #fff',
  //   boxShadow: 24,
  padding: '8px',
  outline: 'none',
  boxShadow: 'none',
};

export default function BasicModal({ children, openModal, setOpenModal, className }: any) {
  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <div style={style} className={className ? className : ''}>
          {children}
        </div>
      </Modal>
    </div>
  );
}
