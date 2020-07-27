import { useState, useEffect, useRef } from "react";
import { throttle } from "LSP/utils/helpers";

const useScroll = () => {
  if (__isBrowser__) {
    const [scroll, setScroll] = useState({
      top: 0,
      bottom: window.innerHeight,
    });
    const throttledScroll = useRef(
      throttle((newScroll) => setScroll(newScroll), 100)
    );

    const handleScroll = () => {
      const { scrollY, innerHeight } = window;
      throttledScroll.current({
        top: scrollY,
        bottom: scrollY + innerHeight,
      });
    };

    useEffect(() => {
      if (__isBrowser__) {
        let poll = setInterval(handleScroll, 5000);
        for (let evt of ["load", "scroll"]) {
          window.addEventListener(evt, handleScroll, {
            passive: true,
            capture: true,
          });
        }
        return () => {
          window.removeEventListener("scroll", handleScroll);
          clearInterval(poll);
        };
      }
    }, []);

    return scroll;
  }
  return { top: 0, bottom: 1000 };
};

export default useScroll;
