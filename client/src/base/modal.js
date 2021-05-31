import React from "react";
import ReactDOM from "react-dom";
import Slide from "../components/Posts/Slide/slide";
import "./style.css";

const Modal = ({ detailModal }) => {
  return (
    <div>
      {/* header */}
      <header className="header">
        <h3>{detailModal.title}</h3>
      </header>
      {/* tag */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {detailModal.tags.map((tag, id) => (
          <div className="tag" key={id.toString()}>
            #{tag}
          </div>
        ))}
      </div>
      {/* body */}
      {detailModal.selectedFile.length > 0 && (
        <div className="messageContainer">
          <div className="modalContent">
            {/* img */}
            <Slide slides={detailModal.selectedFile} />
          </div>
        </div>
      )}
      <div className="modaltext">{detailModal.message}</div>
    </div>
  );
};

export default React.memo(Modal);
