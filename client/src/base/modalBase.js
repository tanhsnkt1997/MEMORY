import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./modal.css";

const Modal = (props) => {
  console.log("nhan dc props", props.show);
  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);

  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [props.show]);

  return (
    props.show &&
    ReactDOM.createPortal(
      <React.Fragment>
        {/* <div className="modal-overlay" /> */}
        <div className="modal-base" onClick={props.onClose}>
          <div className="modal-content-base" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-base">
              <h4 className="modal-title-base">{props.title}</h4>
            </div>
            <div className="modal-body-base">{props.children}</div>
            {/* <div className="modal-footer-base">
              <button type="button" onClick={props.onClose}>
                Close
              </button>
            </div> */}
          </div>
        </div>
      </React.Fragment>,
      document.body
    )
  );
};

export default Modal;
