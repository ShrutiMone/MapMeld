import { useEffect } from "react";

const AlertModal = ({ show, content, onClose }) => {
  useEffect(() => {
    if (show) {
      const modalEl = document.getElementById("exampleModal");
      if (modalEl) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      }
    }
  }, [show]);

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">{content}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AlertModal;