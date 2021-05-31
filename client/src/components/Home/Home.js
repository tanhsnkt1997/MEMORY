import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container, Grow, Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Posts from "../../components/Posts/Posts";
import Form from "../../components/Form/Form";
import { searchPost, getListWithPagination, filterPost } from "../../actions/posts";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import PublishIcon from "@material-ui/icons/Publish";
import useStyles from "./styles";
import Modal from "../../base/modal.js";
import ModalBase from "../../base/modalBase";
import axios from "axios";

import { useLazyLoading, useInfiniteScroll } from "../../customHook/customHook";
import useEffectWhen from "../../customHook/usePrevious";

import "./home.css";

const Home = () => {
  console.log("RENDER HOME");
  //// `cancelToken` chỉ định một cancel token được dùng để hủy request
  const cancelToken = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isShowModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState([]);
  const [element, setElement] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();

  const { page, fetching, posts, more } = useSelector((state) => state.posts); // reducer/index
  const { search, pathname } = useLocation();
  const { keyword, sortBy } = queryString.parse(search);

  //fetching && posts.length
  // .sort((a,b)=> +new Date(b.createdAt) - +new Date(a.createdAt))

  //infinity

  useLazyLoading(".card-img-top", JSON.stringify(...posts.map((item) => item.selectedFile)), posts.length);
  useInfiniteScroll(element);

  useEffect(() => {
    if (cancelToken.current) {
      cancelToken.current.cancel();
    }

    cancelToken.current = axios.CancelToken.source();
    if (pathname.includes("filter")) {
      dispatch(filterPost(keyword, sortBy, page, 10));
      return;
    }
    if (!keyword) {
      dispatch(getListWithPagination(page, 10, cancelToken.current.token));
      return;
    }
    if (keyword) {
      dispatch(searchPost(keyword, page, 10, cancelToken.current.token));
    }
  }, [dispatch, page, keyword, pathname, sortBy]);

  const toggleVisibility = () => {
    if (window.pageYOffset > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      if (cancelToken.current) {
        console.log("cancelToken.current.cancel()", cancelToken.current);
        cancelToken.current.cancel("Cancelling in cleanup");
      }
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const getDetail = useCallback((detailPost) => {
    document.body.style.overflow = "hidden";
    setShowModal((isShowModal) => !isShowModal);
    setDetailModal(detailPost);
  }, []);

  //hideModal
  const hideModal = useCallback(() => {
    document.body.style.overflow = "auto";
    setShowModal((isShowModal) => !isShowModal);
  }, []);

  return (
    <Grow in>
      <Container>
        <Grid className={classes.mainContainer} container justify="space-between" alignItems="stretch" spacing={3}>
          {/* <Grid item xs={12} sm={7}> */}
          <Grid item xs={12} sm={7}>
            <Posts setCurrentId={setCurrentId} posts={posts} getDetail={getDetail} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Form currentId={currentId} setCurrentId={setCurrentId} fetching={fetching} />

            {isVisible ? (
              <div
                className="iconToTop"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <PublishIcon style={{ fontSize: "2rem", color: "#3f51b5" }} />
              </div>
            ) : null}
          </Grid>
        </Grid>

        {/* fetching === true: first load, call axios
         */}

        {!fetching && more && (
          <div
            id="page-bottom-boundary"
            style={{
              border: "5px solid transparent",
            }}
            ref={setElement}
          />
        )}

        <div>
          <div
            style={{
              width: "500px",
              height: "100px",
              display: fetching && posts.length >= 10 && more ? "block" : "none", // > =10 because first load 10 item if item < 10 don't load more
            }}
          >
            <div
              style={{
                backgroundImage: `url("https://mir-s3-cdn-cf.behance.net/project_modules/disp/585d0331234507.564a1d239ac5e.gif")`,
                height: "100%",
                width: "100%",
                backgroundPosition: "center center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        </div>

        {/* <Modal isShowing={isShowModal} hide={hideModal} detailModal={detailModal} /> */}
        <ModalBase title="Chi tiết" onClose={hideModal} show={isShowModal} style={{ minWidth: "200px", maxWidth: "600px" }}>
          <Modal detailModal={detailModal} />
        </ModalBase>
      </Container>
    </Grow>
  );
};

export default React.memo(Home);
