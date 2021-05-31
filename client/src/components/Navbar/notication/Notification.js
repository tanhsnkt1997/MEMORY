import React, { useEffect, useState, useContext } from "react";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { GET_NOTIFICATION } from "../../../constants/actionTypes";
import { getNotif } from "../../../actions/notif";
import "./notification.css";
import WebSocketProvider, { WebSocketContext } from "../../../websocket/websocket";

export default function Notification({ userId }) {
  const ws = useContext(WebSocketContext);
  console.log("o ssssssssss", userId);
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(getNotif(userId));
    }
  }, [dispatch, userId]);

  const listNotification = useSelector((data) => data.notif.list);
  console.log("nhan dc notification", listNotification);

  const styleBody = {
    visibility: hover ? "visible" : "hidden",
  };

  const styleItem = {};
  return (
    <div className="notification__container">
      <span className="notification__notice">{listNotification?.length ? listNotification.length : null}</span>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ width: "100%" }}>
        <NotificationsIcon className="notification__icon" />
        <div className="notification__content_body" style={styleBody}>
          <ul className="notification__content_container">
            {listNotification.length > 0 ? (
              listNotification.map((item) => (
                <li className="notification__content_container_item" style={styleItem}>
                  <div>{item.notification}</div>
                </li>
              ))
            ) : (
              <li className="notification__content_container_item" style={styleItem}>
                Bạn không có thông báo !!!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
