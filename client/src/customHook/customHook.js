import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import defaultImg from "../images/defaultLoad.gif";

// infinite scrolling with intersection observer
export const useInfiniteScroll = (scrollRef) => {
  const dispatch = useDispatch();

  // const scrollObserver = useCallback((node) => {
  //    new IntersectionObserver((entries) => {
  //     entries.forEach((en) => {
  //       // console.log("???????????", en.isIntersecting)
  //       if (en.intersectionRatio > 0 ) {
  //         dispatch({ type: "ADVANCE_PAGE" });
  //       }
  //     });
  //   }, {threshold: 0} ).observe(node);;
  // }, [dispatch]);
  useEffect(() => {
    const callBack = (entries, observer) => {
      entries.forEach((en) => {
        // const firstEntry = en[0];
        // const y = firstEntry.boundingClientRect.y;
        // console.log("yyyyyyyyyyyyy", y)
        if (en.intersectionRatio > 0) {
          dispatch({ type: "ADVANCE_PAGE" });
        }
      });
    };

    const options = {
      threshold: 0,
    };
    const intObs = new IntersectionObserver(callBack, options);

    if (scrollRef) {
      intObs.observe(scrollRef);
      // scrollObserver(scrollRef.current)
    }
    return () => {
      if (scrollRef) {
        intObs.unobserve(scrollRef);
      }
    };
  }, [dispatch, scrollRef]);
};

// lazy load images with intersection observer
export const useLazyLoading = (imgSelector, items) => {
  const imgObserver = useCallback((node) => {
    const intObs = new IntersectionObserver(
      (entries) => {
        // entries : Danh sách các đối tượng chúng ta theo dõi
        entries.forEach((en) => {
          // Kiểm tra ảnh của chúng ta có trong vùng nhìn thấy không
          if (en.intersectionRatio > 0) {
            const currentImg = en.target;
            const newImgSrc = currentImg.dataset?.src;
            // only swap out the image source if the new url exists
            if (!newImgSrc) {
              currentImg.src = defaultImg;
              //gan default image neu url k ton tai
              // console.error("Image source is invalid");
            } else {
              // Lấy dử liệu từ data-src mà chúng ta đã gán trước đó sau đó gàn vào thuộc  tính src của ảnh , lúc này thì ảnh mới bắt đầu tải về
              currentImg.src = newImgSrc;
            }
            intObs.unobserve(node);
          }
        });
      },
      { threshold: 0 }
    );
    intObs.observe(node);
  }, []);

  const imagesRef = useRef(null);

  useEffect(() => {
    imagesRef.current = document.querySelectorAll(imgSelector);
    if (imagesRef.current) {
      console.log("vao day r");
      imagesRef.current.forEach((img) => imgObserver(img));
    }
  }, [imgSelector, items]); //trick
};
