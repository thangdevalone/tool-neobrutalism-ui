import {useEffect, useState} from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Hàm cập nhật kích thước
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Gắn event listener
    window.addEventListener("resize", handleResize);

    // Cleanup khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}

export default useWindowSize;
