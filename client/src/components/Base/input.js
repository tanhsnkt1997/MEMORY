import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import "./input.css";

const Input = ({ onBlur, onFocus, password, placeholder, name, register, ...rest }) => {
  // console.log("===========", props);
  const [isShowPass, setShowPass] = useState(false);
  const [isClick, setClick] = useState(false);
  const inputEl = useRef(null);

  const handleForcus = (e) => {
    if (onFocus) {
      onFocus();
    }
    setClick(true);
  };

  const handleBlur = (e) => {
    if (onBlur) {
      onBlur();
    }
    //validatation val
    if (e.target !== document.activeElement && !e.target.value) {
      setClick(false);
    }
  };

  const setShowPassword = () => {
    const password = document.querySelector(`input[id=pass-${name}]`);
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    setShowPass((show) => !show);
  };

  const renderPass = () => {
    if (isShowPass) {
      return <VisibilityIcon onClick={setShowPassword} className="showIconPassword" />;
    }
    return <VisibilityOffIcon onClick={setShowPassword} className="showIconPassword" />;
  };

  return (
    <div className="inputCustom__Container">
      <input id={`pass-${name}`} type={password ? "password" : "text"} {...register(name)} {...rest} onBlur={handleBlur} onFocus={handleForcus} className="inputCustom__type" style={{ padding: password && "12px 40px 12px 12px" }} />
      <div style={{ transform: isClick && `translateY(-20px)`, fontSize: isClick ? "0.8rem" : "1.1rem", zIndex: 1, backgroundColor: "#fff", textAlign: "center" }} className="inputCustom__placehoder">
        {placeholder}
      </div>
      {password && renderPass()}
    </div>
  );
};

export default Input;
