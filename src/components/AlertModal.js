const AlertModal = ({ show, content, okText, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <p className="mb-4">{content}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
