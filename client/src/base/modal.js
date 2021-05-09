import React from "react";
import ReactDOM from "react-dom";
import Slide from "../../src/components/Posts/Slide/slide";
import "./style.css";

const Modal = ({ isShowing, hide, detailModal }) => {
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className='modal-overlay' />
          <div className='modal-wrapper' aria-modal aria-hidden tabIndex={-1} role='dialog'>
            <div className='modal'>
              <button type='button' className='modal-close-button' data-dismiss='modal' aria-label='Close' onClick={hide}>
                <span aria-hidden='true'>&times;</span>
              </button>

              {/* header */}
              <header className='header'>
                <h3>{detailModal.title}</h3>
              </header>
              {/* tag */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                {detailModal.tags.map((tag, id) => (
                  <div className='tag' key={id.toString()}>
                    #{tag}
                  </div>
                ))}
              </div>
              {/* body */}
              <div className='messageContainer'>
                <div className='modalContent'>
                  {/* img */}
                  {detailModal.selectedFile && <Slide slides={detailModal.selectedFile} />}
                  <div className='modaltext'>{detailModal.message}</div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default React.memo(Modal);
