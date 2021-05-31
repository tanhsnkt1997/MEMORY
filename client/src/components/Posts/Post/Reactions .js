import React, { useState } from "react";
import ReactionItems from "./ReactionItems";

export default function Reactions(props) {
  const [openReaction, setOpenReaction] = useState(false);
  const { items } = props;

  const elementStyle = {
    position: "absolute",
    bottom: "calc(100% + 4px)",
    left: 0,
    visibility: openReaction ? "visible" : "hidden",
    display: "flex",
    listStyle: "none",
    transition: "all 0.4s ease 0.4s",
    opacity: openReaction ? 1 : 0,
    width: "100%",
    borderRadius: "30px",
    background: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <div
      style={{ width: "100%" }}
      onMouseEnter={() => {
        setOpenReaction(true);
      }}
      onMouseLeave={() => setOpenReaction(false)}
      onClick={(e) => {
        e.stopPropagation();
        setOpenReaction(false);
      }}
    >
      <ul style={elementStyle}>
        {props.items.map((item, i) => (
          <div key={i.toString()}>
            <ReactionItems id={item.id} index={i} img={item.img} title={item.description} show={openReaction} onUpdateIcon={props.onUpdateIcon} />
          </div>
        ))}
      </ul>
      <div>{props.children}</div>
    </div>
  );
}

// onClick={() => props.onUpdateIcon("unlike")}
