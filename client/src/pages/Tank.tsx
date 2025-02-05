import React, { useEffect, useRef, useState } from "react";
//MODELS
import TankStatus from "../models/utils/TankStatus";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import styled from "styled-components";

import { GLOBAL_STYLE } from "../utils/constants/constants";

//DATA
import { postsProps, tankDataProps } from "./MapPage";
import CheckPosts from "./CheckPosts";
import BottomNav from "./components/BottomNav";
import PopUp from "./components/PopUp";
import {
  setANewPost,
  updateLastCheck,
  updateLastPostTime,
  updateTankStatus,
} from "../firebase/operations";
import { UserType } from "../models/utils/UsersType";
import {
  ArrowSvg,
  EmptyTank,
  FullTank,
  HalfFullTank,
  UnsetTank,
  Wave,
} from "../utils/constants/Icons";
import {
  Box,
  Button,
  Container,
  Skeleton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { AppProvider } from "@toolpad/core";
import { ArrowBackIos, Height } from "@mui/icons-material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import CommentsDisabledRoundedIcon from "@mui/icons-material/CommentsDisabledRounded";
import { customTheme, UserData } from "../App";
import { Global } from "@emotion/react";

interface TankProps {
  tanksData: tankDataProps[];
  setCookie: (userIdTitle: any, userIdValue: any, option: any) => void;
  cookies: Object;
  // user: {} | null;
  userData: UserData;
}

const Tank = (props: TankProps) => {
  const { tanksData, setCookie, cookies, userData } = props;
  const navigateTo = useNavigate();

  // VARIABLES (STATES)
  const [selectedTankData, setSelectedTankData] = useState<tankDataProps>();
  const tankId: number = parseInt(useParams().id as string);
  const [tankStatus, setTankStatus] = useState<TankStatus>(TankStatus.UNKNOWN);
  // const idTank: Readonly<Params<string>> = useParams();

  const [isConfirmBoxOpen, setIsConfirmBoxOpen] = useState<boolean>(false);

  const [isAddPostAllowed, setIsAddPostAllowed] = useState<boolean>(false);
  const [openBottomNav, setOpenBottomNav] = useState<boolean>(false);
  useEffect(() => {
    const tankData = tanksData.find((tank: tankDataProps) => {
      return tank.id === tankId;
    });

    setSelectedTankData(tankData);
    console.log("UE");
  }, [tankId, tanksData]);

  // METHODS
  const handleConfirmationBox =
    (isConfirmBoxOpen: boolean, tankStatus?: TankStatus) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      setIsConfirmBoxOpen(isConfirmBoxOpen);
      tankStatus && handleTankStatus(tankStatus);
    };

  const handleTankStatus = (tankStatus: TankStatus) => {
    setTankStatus(tankStatus);
  };

  const handleAddPost = (status: TankStatus) => {
    //create a post
    // Add a new post on db :
    let date = new Date();
    let newPostData: postsProps = {
      status: tankStatus,
      userType: userData.name ? UserType.TANKAGENT : UserType.RANDOM,
      userName: userData.name ? userData.name : null,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      weekDay: date.toLocaleDateString([], { weekday: "long" }),
      postTime: date.getTime(),
    };
    if (selectedTankData && newPostData) {
      alert("tank id : " + selectedTankData.id);
      setANewPost(selectedTankData?.id, newPostData);
      // updateTankStatus(selectedTankData?.id, status);

      setIsConfirmBoxOpen(false);
      //Create a Uuid (unique id)
      let newUuid: string = crypto.randomUUID();
      setIsAddPostAllowed(false);
      // Add a cookie that contains the identifier of the user and the maxAge of his cookie (300s => 5min)
      // setCookie("userId", newUuid, { path: "/", maxAge: 300 });
      setCookie("userId", newUuid, { path: "/", maxAge: 100 });
      let now = new Date().getTime();
      updateLastPostTime(tankId, now);
      let diffTime = Math.floor((now - selectedTankData.lastPostTime) / 1000);
      updateLastCheck(selectedTankData.id, diffTime);
      setOpenBottomNav(false);
    }
  };

  const lastPost =
    selectedTankData &&
    selectedTankData.posts &&
    Object.values(selectedTankData.posts).at(-1);

  const headerLarge = 170;
  const headerTight = 70;
  const [headerHeight, setHeaderHeight] = useState<number>(headerLarge);
  const waveHeight =
    lastPost?.status === "EMPTY"
      ? -100
      : lastPost?.status === "HALFFULL"
        ? -headerHeight * 0.5
        : -headerHeight * 0.1;
  useEffect(() => {
    const handleScroll = () => {
      let newHeight; // Minimum height: 100px
      if (window.scrollY > 100) {
        newHeight = headerTight;
      } else {
        newHeight = headerLarge;
      }
      setHeaderHeight(newHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  return (
    <Page
      style={
        // We take the lastPost
        selectedTankData && {
          backgroundColor: selectedTankData.posts
            ? getTankStatusColor(lastPost, "extraLight")
            : customTheme.palette.background.defaultWhite,

          transition: "ease-in-out",
          transitionDelay: "0.5s",
          transitionDuration: "1s",
        }
      }
    >
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            // height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <Header
        headerHeight={headerHeight}
        backgroundColor={customTheme.palette.background.defaultBlue}
        style={{
          transition: "height 0.2s ease-in-out",
        }}
      >
        <HeaderElements headerHeight={headerHeight}>
          <div
            style={{
              // If lang === arabic flex : 1 else 0
              flex: 0,
              justifyContent: "left",
              alignItems: "flex-start",
            }}
          >
            <Button
              size="large"
              onClick={() => navigateTo("/mapPage")}
              sx={{ padding: 0 }}
            >
              <ChevronLeftRoundedIcon
                sx={{
                  color: customTheme.palette.background.defaultWhite,
                  fontSize: "50px",
                }}
              />
            </Button>
          </div>
          <PopUpMainElements
            sx={{
              "& svg": {
                height: headerHeight > headerTight ? "70px" : "50px",
                transition: "ease 0.2s",
              },
            }}
          >
            <div id="tank_texts">
              <Typography
                variant="h2"
                id="tank_name"
                color={customTheme.palette.background.defaultWhite}
                style={{ lineHeight: "1.8" }}
              >
                {selectedTankData?.name}
              </Typography>
              <Typography
                variant="h3"
                id="tank_description"
                style={
                  selectedTankData && {
                    color: selectedTankData.posts
                      ? getTankStatusColor(lastPost, "extraLight")
                      : customTheme.palette.background.blueExtraLight,
                  }
                }
              >
                {headerHeight > headerTight &&
                  (selectedTankData && selectedTankData.posts
                    ? lastPost?.status === TankStatus.EMPTY
                      ? "water tank is empty"
                      : lastPost?.status === TankStatus.HALFFUll
                        ? "water tank is half full"
                        : "water tank is full "
                    : "No infos has been set for this tank")}
              </Typography>
            </div>
            {selectedTankData && selectedTankData.posts
              ? lastPost?.status === TankStatus.EMPTY
                ? EmptyTank()
                : lastPost?.status === TankStatus.HALFFUll
                  ? HalfFullTank()
                  : FullTank()
              : UnsetTank()}
          </PopUpMainElements>

          {/* <span id="checkPosts_title"> : حالة تدفق المياه حسب المستخدمين </span> */}
        </HeaderElements>
        {/* {headerHeight > headerTight && (
          <span id="checkPosts_title">
            {"Water flow state according to users reports :"}
          </span>
        )} */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            lineHeight: 0,
            transition: "2s cubic-bezier(0.42, 0.53, 0.6, 0.61)",
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
                animation:
                  "waveAnim 4s infinite cubic-bezier(0.42, 0.53, 0.6, 0.61)",
                transition: "2s cubic-bezier(0.42, 0.53, 0.6, 0.61)",
                opacity: 0.1,
                bottom: waveHeight,
                zIndex: -1,
              }}
            >
              <Wave backgroundColor={getTankStatusColor(lastPost, "basic")} />
            </div>

            <div
              style={{
                position: "absolute",
                left: "100%",
                width: "100%",
                animation:
                  "waveAnim 4s infinite cubic-bezier(0.42, 0.53, 0.6, 0.61)",
                transition: "2s cubic-bezier(0.42, 0.53, 0.6, 0.61)",
                bottom: waveHeight,
                opacity: 0.1,
                zIndex: -1,
              }}
            >
              <Wave backgroundColor={getTankStatusColor(lastPost, "basic")} />
            </div>
          </div>
        </div>
      </Header>

      {selectedTankData && selectedTankData.posts ? (
        <div>
          <CheckPosts tankData={selectedTankData} />
        </div>
      ) : (
        <div
          style={{
            paddingBottom: "100px",
            paddingTop: "50vh",
            textAlign: "center",
          }}
        >
          <CommentsDisabledRoundedIcon
            style={{
              fontSize: "50px",
              color: customTheme.palette.background.blueDark,
            }}
          />
          <Typography
            variant="h3"
            style={{ color: customTheme.palette.background.blueDark }}
          >
            No cistern state has been posted
          </Typography>
        </div>
      )}
      {selectedTankData &&
        (console.log("selectedTankData >", selectedTankData),
        (
          <BottomNav
            selectedTankData={selectedTankData}
            setConfirmationBox={handleConfirmationBox}
            tankLatLng={selectedTankData.latLng}
            openBottomNav={openBottomNav}
            setOpenBottomNav={setOpenBottomNav}
            setTankStatus={handleTankStatus}
            cookies={cookies}
            isAddPostAllowed={isAddPostAllowed}
            setIsAddPostAllowed={setIsAddPostAllowed}
            userData={userData}
          />
        ))}
      {isConfirmBoxOpen &&
        (console.log("isConfirmBox >", isConfirmBoxOpen),
        (
          <PopUp
            tankStatus={tankStatus}
            isConfirmBoxOpen={isConfirmBoxOpen}
            addPost={handleAddPost}
            setConfirmationBox={handleConfirmationBox}
          />
        ))}
    </Page>
  );
};

export const getTankStatusColor = (
  // tank: tankDataProps | undefined,
  lastPost: postsProps | undefined,
  mode: "dark" | "basic" | "light" | "extraLight"
) => {
  return lastPost
    ? lastPost?.status === TankStatus.EMPTY
      ? mode === "basic"
        ? customTheme.palette.background.red
        : mode === "dark"
          ? customTheme.palette.background.redDark
          : mode === "light"
            ? customTheme.palette.background.redLight
            : customTheme.palette.background.redExtraLight
      : lastPost?.status === TankStatus.HALFFUll
        ? mode === "basic"
          ? customTheme.palette.background.yellow
          : mode === "dark"
            ? customTheme.palette.background.yellowDark
            : mode === "light"
              ? customTheme.palette.background.yellowLight
              : customTheme.palette.background.yellowExtraLight
        : mode === "basic"
          ? customTheme.palette.background.blue
          : mode === "dark"
            ? customTheme.palette.background.blueDark
            : mode === "light"
              ? customTheme.palette.background.blueLight
              : customTheme.palette.background.blueExtraLight
    : customTheme.palette.background.defaultBlue;
};
export const getPostsStatusColor = (
  post: postsProps | undefined,
  mode: "basic" | "light"
) => {
  return post?.status === TankStatus.EMPTY
    ? mode === "basic"
      ? customTheme.palette.background.red
      : customTheme.palette.background.redLight
    : post?.status === TankStatus.HALFFUll
      ? mode === "basic"
        ? customTheme.palette.background.yellow
        : customTheme.palette.background.yellowLight
      : mode === "basic"
        ? customTheme.palette.background.blue
        : customTheme.palette.background.blueLight;
};

// *********************
// ***** STYLES
// *********************
const Page = styled.div`
  min-height: 100vh;
`;
const Header = styled(Box)<{ headerHeight: number; backgroundColor: string }>`
  display: flex column;
  justify-content: space-between;
  padding: 10px;
  background-color: ${(props) => props.backgroundColor};
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 10px 0px;
  position: fixed;
  z-index: 10;
  width: 100%;
  height: ${(props) => props.headerHeight + "px"};
  overflow: hidden;

  #checkPosts_title {
    color: ${() => customTheme.palette.background.defaultWhite};
  }

  @keyframes waveAnim {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;
const HeaderElements = styled.div<{ headerHeight: number }>`
  display: flex;
  justify-content: space-between;
  flex-direction: ${(props) => (props.headerHeight < 170 ? "row" : "column")};
  /* margin: 20px 0; */
`;
const PopUpMainElements = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 0 20px;

  #tank_texts {
    margin: 0 20px;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  }

  #tank_text p {
    margin: 2px;
    /* text-align: right; */
  }
  #tank_description {
    font-family: "changa";
    font-weight: 600;
  }
`;

export default Tank;
