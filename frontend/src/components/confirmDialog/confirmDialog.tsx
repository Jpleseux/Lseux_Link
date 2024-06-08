// ConfirmationDialog.tsx
import React from 'react';
import './ConfirmationDialog.css';

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-dialog">
      <div className="dialog-content">
        <p>{message}</p>
        <div className="dialog-buttons">
          <button className="cancel-button" onClick={onCancel}>Cancelar</button>
          <button className="confirm-button" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
