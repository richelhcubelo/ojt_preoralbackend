import React from "react";
import "./modal.scss";

interface ModalProps {
  show: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm?: () => void;
  size?:
    | "small"
    | "smallmed"
    | "medium"
    | "medium2"
    | "medlarge"
    | "large"
    | "extralarge";
  singleButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  children?: React.ReactNode;
  modalClassName?: string;
  hideButtons?: boolean;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  show,
  onCancel,
  onConfirm,
  size = "small",
  singleButton = false,
  cancelButtonText = "Cancel",
  confirmButtonText = "Confirm",
  children,
  onClose, // Destructured onClose prop
}) => {
  if (!show) return null;

  const modalClass = `modal-content ${size}`;

  return (
    <div className="modal-overlay">
      <div className={modalClass}>
        <div className="modal-content-inner">
          {children}
          <div className="modal-buttons">
            {!singleButton && (
              <>
                <button className="cancel-button" onClick={onCancel}>
                  {cancelButtonText}
                </button>
                <button className="confirm-button" onClick={onConfirm}>
                  {confirmButtonText}
                </button>
              </>
            )}
            {singleButton && (
              <button className="confirm-button" onClick={onCancel}>
                {confirmButtonText}
              </button>
            )}
          </div>
        </div>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
