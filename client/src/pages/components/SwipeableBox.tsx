import React, { useEffect, useState } from "react";
import { customTheme } from "../../App";
import { Button, Typography } from "@mui/material";

type SwipeableBoxProps = {
  navLabel: string;
  openBottomNav: boolean;
  setOpenBottomNav: (state: boolean) => void;
  children?: React.ReactNode;
};
const SwipeableBox: React.FC<SwipeableBoxProps> = ({
  navLabel,
  openBottomNav,
  setOpenBottomNav,
  children,
  ...props
}) => {
  const navMinHeight = 60;
  const navMaxHeight = 400;
  const navBottom = 10;
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState<{ y: number }>({
    y: 600,
  });
  const [navHeight, setNavHeight] = useState<number>(navMinHeight);

  useEffect(() => {
    const preventTouchScroll = (event: TouchEvent) => {
      event.preventDefault();
    };
    //We attach a non-passive event listener to prevent background scrolling
    const bottomNav = document.getElementById("bottomNav");
    bottomNav?.addEventListener("touchmove", preventTouchScroll, {
      passive: false,
    });

    return () => {
      bottomNav?.removeEventListener("touchmove", preventTouchScroll);
    };
  }, []);

  useEffect(() => {
    if (openBottomNav) {
      setNavHeight(navMaxHeight);
    } else {
      setNavHeight(navMinHeight);
    }
  }, [openBottomNav]);
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    console.log("ScreenY : ", window.visualViewport?.height);

    window.visualViewport &&
      setNavHeight(window.visualViewport?.height - touch.clientY - navBottom);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    console.log("End >", event.touches);
    setIsDragging(true);
    if (navHeight > navMaxHeight / 2) {
      setNavHeight(navMaxHeight);
      setOpenBottomNav(true);
    } else {
      setNavHeight(navMinHeight);
      setOpenBottomNav(false);
    }
  };

  return (
    <div
      id="bottomNav"
      {...props}
      style={{
        position: "fixed",
        zIndex: 20,
        // height: navHeight,
        width: "-webkit-fill-available",
        margin: "10px",
        textAlign: "center",
        // top: mousePos.y,
        height: navHeight,
        minHeight: navMinHeight,
        maxHeight: navMaxHeight,
        borderRadius: "30px",
        bottom: navBottom,
        overflow: "hidden",

        boxShadow: "0px -10px 10px -10px rgba(0, 0, 0, 0.2)",
        transition: "0.05s linear",
      }}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: "none", // Ensures no scrolling even if preventDefault() fails
          backgroundColor: customTheme.palette.background.defaultWhite,
          height: 60,
        }}
      >
        <div
          style={{
            width: 30,
            height: 6,
            backgroundColor: customTheme.palette.background.blueDark,
            borderRadius: 3,
            position: "absolute",
            top: 8,
            left: "calc(50% - 15px)",
          }}
        />
        <Typography
          variant="h3"
          sx={{
            p: 2,
            fontSize: "1.2em",
            fontWeight: "500",
            lineHeight: "unset",
            color: customTheme.palette.background.blueDark,
            textAlign: "center",
          }}
        >
          {navLabel}
        </Typography>
      </div>
      <div style={{ height: navMaxHeight - navMinHeight }}>{children}</div>
    </div>
  );
};

export default SwipeableBox;
