import React, { useState, useEffect } from "react";
import memories from "../../images/memories.png";
import { AppBar, Typography, Toolbar, Avatar, Button, Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import Search from "./Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import Modal from "../../base/modalBase";

import useStyles from "./styles";
import "./modalChangeInfo.css";

const Navbar = () => {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile"))); //default getItem null
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [birthDay, setBirthDay] = useState({
    day: 1,
    dayInMonth: 1,
    month: 1,
    year: 1990,
  });

  const [show, setShow] = useState(false);
  const [showBirthDay, setShowBirthDay] = useState({
    day: false,
    month: false,
    year: false,
  });

  console.log("----------------->", showBirthDay.day);

  useEffect(() => {
    //JWT......
    // if (token) {
    //   const decodedToken = decode(token);
    //   if (decodedToken.exp * 1000 < new Date().getTime()) {

    //     // logout();
    //   }
    // }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location.pathname]);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/");
    setUser(null); //show btn login
  };

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  function leapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  useEffect(() => {
    const day = daysInMonth(birthDay.month, birthDay.year);
    if (day < birthDay.day) {
      setBirthDay({ ...birthDay, day });
    }
  }, [birthDay.month, birthDay.year]);

  const handle = (targer) => {
    setBirthDay({ ...birthDay, dayInMonth: daysInMonth(birthDay.month, birthDay.year) });
    trickgerCloseBirthday(targer);
  };

  const trickgerCloseBirthday = (targer) => {
    // setBirthDay({ ...birthDay, dayInMonth: daysInMonth(birthDay.month, birthDay.year) });
    if (targer === "day") {
      setShowBirthDay({ day: !showBirthDay.day, month: false, year: false });
    }
    if (targer === "month") {
      setShowBirthDay({ day: false, month: !showBirthDay.month, year: false });
    }
    if (targer === "year") {
      setShowBirthDay({ day: false, month: false, year: !showBirthDay.year });
    }
  };

  const showViewDay = () => {
    var dayInView = [];
    for (let i = 1; i <= birthDay.dayInMonth; i++) {
      dayInView.push(
        <div
          style={{ cursor: "pointer", margin: "5px 10px" }}
          key={i.toString()}
          onClick={(e) => {
            e.stopPropagation();
            setBirthDay({ ...birthDay, day: i });
            trickgerCloseBirthday("day");
          }}
        >
          {i}
        </div>
      );
    }
    return dayInView;
  };

  const showViewMonth = () => {
    var MonthInView = [];
    for (let i = 1; i <= 12; i++) {
      MonthInView.push(
        <div
          style={{ cursor: "pointer", margin: "6px 10px" }}
          key={i.toString()}
          onClick={(e) => {
            e.stopPropagation();
            setBirthDay({ ...birthDay, month: i });
            trickgerCloseBirthday("month");
          }}
        >
          Tháng {i}
        </div>
      );
    }
    return MonthInView;
  };

  const showViewYear = () => {
    var yearInView = [];
    const nowYear = new Date().getFullYear();
    for (let i = 1990; i <= nowYear; i++) {
      yearInView.push(
        <div
          style={{ cursor: "pointer", margin: "5px 10px" }}
          key={i.toString()}
          onClick={(e) => {
            e.stopPropagation();
            setBirthDay({ ...birthDay, year: i });
            trickgerCloseBirthday("year");
          }}
        >
          {i}
        </div>
      );
    }
    return yearInView;
  };

  return (
    <>
      <AppBar className={classes.appBar} position="fixed" color="inherit">
        <div className={classes.brandContainer}>
          <Typography component={"a"} href="/" className={classes.heading} variant="h2" align="center">
            Memories
          </Typography>
          <img className={classes.image} src={memories} alt="icon" height="60" />
        </div>
        {/* SEARCH BAR */}
        <Search user={user} />

        <Toolbar className={classes.toolbar}>
          {user ? (
            <div className={classes.profile}>
              <Box display="flex" onClick={() => setShow(true)}>
                <Avatar className={classes.purple} alt={user.name} src={user.imageUrl}>
                  {user.name.charAt(0)}
                </Avatar>
                <Typography className={classes.userName} variant="h6">
                  {user.name}
                </Typography>
              </Box>

              <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <Button component={Link} to="/auth" variant="contained" color="primary">
                Sign In
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Modal title="Thông tin tài khoản" onClose={() => setShow(false)} show={show}>
        <div
          class="modalChangeinfo__bodyContainer"
          onClick={() => {
            setShowBirthDay({ day: false, month: false, year: false });
          }}
        >
          <div class="modalChangeinfo__bodyLeftContainer">
            <div className="modalChangeinfo__avatar">{user?.name.charAt(0)}</div>
            <label className="btn-fake-avatar" for="file-avatar">
              Chọn ảnh
            </label>
            <input id="file-avatar" type="file" />
            <div className="modalChangeinfo__descriptionAvatar">Dụng lượng file tối đa 1 MB </div>
            <div className="modalChangeinfo__descriptionAvatar">Định dạng:.JPEG, .PNG</div>
          </div>
          {/*  */}
          <div class="modalChangeinfo__bodyRightContainer">
            <div className="modalChangeinfo__InputWithLabel">
              <label className="modalChangeinfo__lableInput">Tên</label>
              <div className="modalChangeinfo__InputWraper">
                <input className="modalChangeinfo__Input" type="text" />
              </div>
            </div>

            <div className="modalChangeinfo__InputWithLabel">
              <label className="modalChangeinfo__lableInput">Số điện thoại</label>
              <div className="modalChangeinfo__InputWraper">
                <input className="modalChangeinfo__Input" type="text" />
              </div>
            </div>

            <div className="modalChangeinfo__InputWithLabel">
              <label className="modalChangeinfo__lableInput">Giới tính</label>
              <div className="modalChangeinfo__RadioWraper">
                <div className="modalChangeinfo__RadioWraperWithLabel">
                  <input name="gender" value="male" className="modalChangeinfo__BtnRadio" type="radio" />
                  <label className="modalChangeinfo__RadioLabel">Nam</label>
                </div>
                <div className="modalChangeinfo__RadioWraperWithLabel">
                  <input name="gender" value="female" className="modalChangeinfo__BtnRadio" type="radio" />
                  <label className="modalChangeinfo__RadioLabel">Nữ</label>
                </div>
                <div className="modalChangeinfo__RadioWraperWithLabel">
                  <input name="gender" value="others" className="modalChangeinfo__BtnRadio" type="radio" />
                  <label className="modalChangeinfo__RadioLabel">Khác</label>
                </div>
              </div>
            </div>
            <div className="modalChangeinfo__InputWithLabel" onClick={(e) => e.stopPropagation()}>
              <label className="modalChangeinfo__lableInput">Ngày sinh</label>
              <div className="modalChangeinfo__InputBirthDayWraper">
                <div id="dayBirthDay" onClick={() => handle("day")} className="modalChangeinfo__BirthDayChoose" style={{ border: showBirthDay.day && "1px solid rgba(0, 183, 255, 1)" }}>
                  <span className="modalChangeinfo__BirthDayChooseLabel">{birthDay.day}</span>
                  {showBirthDay.day ? <ExpandLessIcon className="modalChangeinfo__BirthDayChooseIcon" /> : <ExpandMoreIcon className="modalChangeinfo__BirthDayChooseIcon" />}
                  {showBirthDay.day && <div className="modalChangeinfo__DayBirthDay">{showViewDay()}</div>}
                </div>

                <div id="monthBirthDay" onClick={() => handle("month")} className="modalChangeinfo__BirthDayChoose" style={{ border: showBirthDay.month && "1px solid rgba(0, 183, 255, 1)" }}>
                  <span className="modalChangeinfo__BirthDayChooseLabel">{`Tháng ${birthDay.month}`}</span>
                  {showBirthDay.month ? <ExpandLessIcon className="modalChangeinfo__BirthDayChooseIcon" /> : <ExpandMoreIcon className="modalChangeinfo__BirthDayChooseIcon" />}
                  {showBirthDay.month && <div className="modalChangeinfo__DayBirthDay">{showViewMonth()}</div>}
                </div>
                <div id="yearBirthDay" onClick={() => handle("year")} className="modalChangeinfo__BirthDayChoose" style={{ border: showBirthDay.year && "1px solid rgba(0, 183, 255, 1)" }}>
                  <span className="modalChangeinfo__BirthDayChooseLabel">{birthDay.year}</span>
                  {showBirthDay.year ? <ExpandLessIcon className="modalChangeinfo__BirthDayChooseIcon" /> : <ExpandMoreIcon className="modalChangeinfo__BirthDayChooseIcon" />}
                  {showBirthDay.year && <div className="modalChangeinfo__DayBirthDay">{showViewYear()}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="modalChangeinfo__btnUpdate">Thay đổi</button>
      </Modal>
    </>
  );
};

export default Navbar;
