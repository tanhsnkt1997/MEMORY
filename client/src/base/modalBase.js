import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import useDelayUnmount from "../customHook/useDelayUnmount";
import "./modal.css";

const mountedStyle = { animation: "inAnimation 250ms ease-in" };
const unmountedStyle = {
  animation: "outAnimation 270ms ease-out",
  animationFillMode: "forwards",
};

const Modal = (props) => {
  console.log("render modal");
  const showDiv = useDelayUnmount(props.show, 250);

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

  const styleAnimation = props.show ? mountedStyle : unmountedStyle;
  return (
    showDiv &&
    ReactDOM.createPortal(
      <React.Fragment>
        {/* <div className="modal-overlay" /> */}
        <div className="modal-base" onClick={props.onClose}>
          <div className="modal-content-base" onClick={(e) => e.stopPropagation()} style={{ ...props.style, ...styleAnimation }}>
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
