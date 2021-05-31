import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RESET_POST } from "../../constants/actionTypes";
import queryString from "query-string";
import "./style.css";

const Search = ({ user }) => {
  const { search } = useLocation();
  const { keyword } = queryString.parse(search);
  const dataHistory = JSON.parse(localStorage.getItem("history"));
  const listHistory = dataHistory || [];
  const [textSearch, setTextSearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  // console.log("window.location.search", window.location.search); //trick
  const params = new URLSearchParams();

  const saveHistory = () => {
    if (listHistory.indexOf(textSearch) === -1) {
      if (listHistory.length === 10) {
        listHistory.pop();
        localStorage.setItem("history", JSON.stringify([textSearch, ...listHistory]));
      } else {
        localStorage.setItem("history", JSON.stringify([textSearch, ...listHistory]));
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && textSearch && keyword !== textSearch) {
      params.append("keyword", textSearch);
      history.push({ pathname: "/posts/search", search: params.toString() });
      saveHistory();
      // history.push({
      //   pathname: "/posts/search",
      //   search: `?key=${textSearch}&page=${page}&limit=${limit}`,
      // });
      dispatch({ type: RESET_POST });
    } else if (e.key === "Enter" && !textSearch) {
      // params.delete("key") //example delete params
      window.location.href = "/";
    }
  };

  const filterPost = (e) => {
    const params = new URLSearchParams();
    dispatch({ type: RESET_POST });
    params.append("keyword", textSearch);
    params.append("sortBy", e.target.value);
    history.push({ pathname: "/posts/filter", search: params.toString() });
  };

  const showListHistory = () => {
    setShowHistory((isShow) => !isShow);
    document.body.addEventListener("click", haha);
  };

  const haha = (e) => {
    if (document.querySelector(".listHistory").style.display === "block") {
      if (!e.target.classList.contains("input__navbar__search")) {
        setShowHistory(false);
        document.body.removeEventListener("click", haha);
      }
    }
  };

  // document.querySelector('input[name="input"]')?.addEventListener("click", (e) => {
  //   setShowHistory(true);
  // });

  useEffect(() => {
    return function cleanup() {
      document.body.removeEventListener("click", haha);
    };
  }, []);

  // console.log( document.querySelector('input[name="input"]'))

  const selectHistory = (textSearch) => {
    setTextSearch(textSearch);
    params.append("keyword", textSearch);
    history.push({ pathname: "/posts/search", search: params.toString() });
    dispatch({ type: RESET_POST });
  };

  return (
    <div
      className="search"
      style={{
        boxShadow: "0 1px 3px #e0e0e0",
        width: "300px",
        display: "flex",
        alignItems: "center",
        border: "1px solid  #e0e0e0",
        borderRadius: "5px",
        height: "50px",
      }}
    >
      <div className="searchContainer">
        <div style={{ display: "flex", height: "100%" }}>
          <div
            style={{
              backgroundColor: "#1976d2",
              padding: "0 5px",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              height: "100%",
            }}
          >
            <SearchIcon style={{ marginLeft: "5px", color: "#fff" }} />
          </div>

          <input
            name="input"
            className="input__navbar__search"
            placeholder="Search..."
            style={{
              borderColor: "transparent",
              outline: "none",
              width: "100%",
              margin: "0 5px",
              padding: "8px 0",
            }}
            value={textSearch}
            onFocus={showListHistory}
            onChange={(e) => setTextSearch(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        <div
          className="listHistory"
          style={{
            display: showHistory && listHistory.length > 0 ? "block" : "none",
          }}
        >
          {listHistory.map((history, index) => (
            <div onClick={() => selectHistory(history)} className="itemHitory" key={index}>
              {history}
            </div>
          ))}
        </div>
      </div>

      {user && (
        <select className="select" onChange={filterPost}>
          <option value="asc">Mới nhất</option>
          <option value="dsc">Cũ nhất</option>
          <option value="ofme">Của tôi</option>
        </select>
      )}
    </div>
  );
};

export default Search;
