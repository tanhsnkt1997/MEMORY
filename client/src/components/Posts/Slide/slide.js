import React, {useState, useEffect} from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import "./style.css";

const delay = 2300;
const Slide = ({slides}) => {
    const [current, setCurrent] = useState(0);
    const length = slides.length;
    const timeoutRef = React.useRef(null);

    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    React.useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => setCurrent((prevIndex) => (prevIndex === length - 1 ? 0 : prevIndex + 1)), delay);

        return () => {
            resetTimeout();
        };
    }, [current]);

    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }
    return (
        <>
            {/*  */}
            <div className='slideshow'>
                <NavigateBeforeIcon onClick={() => prevSlide()} className='btnSlide' style={{left: "5px"}}/>
                <NavigateNextIcon onClick={() => nextSlide()} className='btnSlide' style={{right: "5px"}}/>
                <div className='slideshowSlider' style={{transform: `translate3d(${-current * 100}%, 0, 0)`}}>
                    {slides.map((slide, index) => (
                        <img key={index.toString()} src={slide} alt='travel image' className='slide'/>
                    ))}
                </div>
                <div className='slideshowDots'>
                    {slides.map((_, idx) => (
                        <div
                            key={idx.toString()}
                            className={`slideshowDot${current === idx ? " active" : ""}`}
                            onClick={() => {
                                setCurrent(idx);
                            }}/>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Slide;
