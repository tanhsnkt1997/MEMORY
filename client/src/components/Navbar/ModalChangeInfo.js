import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useDispatch } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { updateProfile } from "../../actions/user";
import _ from "lodash";
import { usePrevious } from "../../customHook/usePrevious";
import Modal from "../../base/modalBase";
import "./modalChangeInfo.css";

const ModalChangeInfo = forwardRef((props, ref) => {
  const userAsync = JSON.parse(localStorage.getItem("profile"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile"))); //default getItem null
  const jsDate = new Date(user.birthDay);
  const initialState = { day: jsDate.getDate() || 1, dayInMonth: 0, month: jsDate.getMonth() || 1, year: jsDate.getFullYear() || 1990, file: "", fileShowAvatar: user?.avatar, name: user?.name, gender: user?.gender, phoneNumber: user?.phoneNumber };

  const dispatch = useDispatch();
  const [birthDay, setBirthDay] = useState(initialState);

  const [show, setShow] = useState(false);
  const [showBirthDay, setShowBirthDay] = useState({ day: false, month: false, year: false });

  useImperativeHandle(ref, () => ({
    isOpenModal() {
      setShow((show) => !show);
    },
  }));

  const prevProfile = usePrevious(user);
  useEffect(() => {
    if (!_.isEqual(prevProfile, userAsync)) {
      setUser(userAsync);
      setBirthDay(initialState);
    }
  }, [userAsync, prevProfile]);

  useEffect(() => {
    const day = daysInMonth(birthDay.month, birthDay.year);
    if (day < birthDay.day) {
      setBirthDay({ ...birthDay, day });
    }
  }, [birthDay.month, birthDay.year]);

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  const handle = (targer) => {
    setBirthDay({ ...birthDay, dayInMonth: daysInMonth(birthDay.month, birthDay.year) });
    trickgerCloseBirthday(targer);
  };

  const trickgerCloseBirthday = (targer) => {
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

  const handleChangeFile = (e) => {
    console.log("e.target.files[0]", e.target.files[0]);
    let file = e.target.files[0];
    let typeFiles = ["image/png", "image/jpg", "image/jpeg"];
    if (typeFiles.indexOf(file.type) === -1) {
      alert("Kiểu file không hỗ trợ !! Vui lòng thử lại.");
      return;
    }
    if (file.size > 1048576) {
      alert("Kích thước tối đa là 1MB !! Vui lòng thử lại.");
      return;
    }
    //1 file
    setBirthDay({ ...birthDay, file: e.target.files[0], fileShowAvatar: URL.createObjectURL(e.target.files[0]) });
  };

  const handleCloseModal = () => {
    setBirthDay(initialState);
    setShow(false);
  };

  const handleUploadProfile = (e) => {
    const { year, month, day, file, name, phoneNumber, gender } = birthDay;
    const birthDayToTimeStamp = new Date(year, month, day).getTime();
    let ProfileFormData = new FormData();
    ProfileFormData.append("image", file);
    ProfileFormData.append("name", name);
    ProfileFormData.append("phoneNumber", phoneNumber);
    ProfileFormData.append("gender", gender);
    ProfileFormData.append("birthDay", birthDayToTimeStamp);

    dispatch(updateProfile(user._id, ProfileFormData)); //
  };

  return (
    <Modal title="Thông tin tài khoản" onClose={handleCloseModal} show={show}>
      <div
        className="modalChangeinfo__bodyContainer"
        onClick={() => {
          setShowBirthDay({ day: false, month: false, year: false });
        }}
      >
        <div className="modalChangeinfo__bodyLeftContainer">
          <img className="modalChangeinfo__avatar" src={birthDay.fileShowAvatar} alt="avatar" />

          {/* {birthDay.file ? <img className="modalChangeinfo__avatar" src={URL.createObjectURL(birthDay.file[0])} /> : <div className="modalChangeinfo__avatar">{user?.name.charAt(0)}</div>} */}

          <label className="btn-fake-avatar" htmlFor="file-avatar">
            Chọn ảnh
          </label>
          <input accept="image/*" onChange={handleChangeFile} id="file-avatar" type="file" />
          <div className="modalChangeinfo__descriptionAvatar">Dụng lượng file tối đa 1 MB </div>
          <div className="modalChangeinfo__descriptionAvatar">Định dạng:.JPEG, .PNG</div>
        </div>
        {/*  */}
        <div className="modalChangeinfo__bodyRightContainer">
          <div className="modalChangeinfo__InputWithLabel">
            <label className="modalChangeinfo__lableInput">Tên</label>
            <div className="modalChangeinfo__InputWraper">
              <input value={birthDay.name} onChange={(e) => setBirthDay({ ...birthDay, name: e.target.value })} className="modalChangeinfo__Input" type="text" />
            </div>
          </div>

          <div className="modalChangeinfo__InputWithLabel">
            <label className="modalChangeinfo__lableInput">Số điện thoại</label>
            <div className="modalChangeinfo__InputWraper">
              <input value={birthDay.phoneNumber} onChange={(e) => setBirthDay({ ...birthDay, phoneNumber: e.target.value })} className="modalChangeinfo__Input" type="text" />
            </div>
          </div>

          <div className="modalChangeinfo__InputWithLabel">
            <label className="modalChangeinfo__lableInput">Giới tính</label>
            <div className="modalChangeinfo__RadioWraper">
              <div className="modalChangeinfo__RadioWraperWithLabel">
                <input checked={birthDay.gender === "male"} onChange={(e) => setBirthDay({ ...birthDay, gender: e.target.value })} name="gender" value="male" className="modalChangeinfo__BtnRadio" type="radio" />
                <label className="modalChangeinfo__RadioLabel">Nam</label>
              </div>
              <div className="modalChangeinfo__RadioWraperWithLabel">
                <input checked={birthDay.gender === "female"} onChange={(e) => setBirthDay({ ...birthDay, gender: e.target.value })} name="gender" value="female" className="modalChangeinfo__BtnRadio" type="radio" />
                <label className="modalChangeinfo__RadioLabel">Nữ</label>
              </div>
              <div className="modalChangeinfo__RadioWraperWithLabel">
                <input checked={birthDay.gender === "others"} onChange={(e) => setBirthDay({ ...birthDay, gender: e.target.value })} name="gender" value="others" className="modalChangeinfo__BtnRadio" type="radio" />
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
      <button onClick={handleUploadProfile} className="modalChangeinfo__btnUpdate">
        Thay đổi
      </button>
    </Modal>
  );
});

export default ModalChangeInfo;
