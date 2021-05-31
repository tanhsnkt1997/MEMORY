import React, { useState } from "react";

export default function ReactionItems(props, {}) {
  const [hover, setHover] = useState(false);
  const { key, id, index, img, title, show } = props;
  const delay = index / 20 + 0.15;
  const divStyle = {
    possition: "relative",
    padding: "6px 4px 0px",
    opacity: show ? 1 : 0,
    cursor: "pointer",
    transition: `transform 0.3s ${delay}s cubic-bezier(.76,.26,.28,1.4), opacity 0.2s ${delay}s`,
    transform: show ? "translateY(0px) scale(1)" : "translateY(30px) scale(0.8)",
  };

  const itemImgStyle = {
    width: "30px",
    objectFit: "cover",
    transition: "all 0.2s",
    transform: hover ? "translateY(-2px) scale(1.4)" : "translateY(0px) scale(1)",
  };

  const titleStyle = {
    position: "absolute",
    bottom: "calc(100% + 5px)",
    display: hover ? "block" : "none",
    background: "rgba(0, 0, 0, 0.8)",
    color: "#ffff",
    borderRadius: "15px",
    padding: "3px 7px",
    fontSize: "10px",
    transition: "all 0.2s",
    opacity: hover ? 1 : 0,
  };
  return (
    <li
      key={index.toString()}
      style={divStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        // e.stopPropagation();
        props.onUpdateIcon(id);
      }}
    >
      <span style={titleStyle}>{title}</span>
      <img alt="img" src={img} style={itemImgStyle} />
    </li>
  );
}
