import React, { useEffect, useState } from "react";
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
import { ArrowBackIos } from "@mui/icons-material";
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
      <Header backgroundColor={customTheme.palette.background.defaultBlue}>
        <HeaderElements>
          <div
            style={{
              // If lang === arabic flex : 1 else 0
              flex: 0,
              justifyContent: "left",
              alignItems: "flex-start",
            }}
          >
            <Button size="large" onClick={() => navigateTo("/mapPage")}>
              <ChevronLeftRoundedIcon
                sx={{
                  color: customTheme.palette.background.defaultWhite,
                  fontSize: "50px",
                }}
              />
            </Button>
          </div>
          <PopUpMainElements>
            {selectedTankData && selectedTankData.posts
              ? lastPost?.status === TankStatus.EMPTY
                ? EmptyTank()
                : lastPost?.status === TankStatus.HALFFUll
                  ? HalfFullTank()
                  : FullTank()
              : UnsetTank()}
            <div id="tank_text">
              <Typography variant="h2" id="tank_name">
                {selectedTankData?.name}
              </Typography>
              <p
                id="tank_description"
                style={
                  selectedTankData && {
                    color: selectedTankData.posts
                      ? getTankStatusColor(lastPost, "extraLight")
                      : customTheme.palette.background.blueExtraLight,
                  }
                }
              >
                {selectedTankData && selectedTankData.posts
                  ? lastPost?.status === TankStatus.EMPTY
                    ? "water tank is empty"
                    : lastPost?.status === TankStatus.HALFFUll
                      ? "water tank is half full"
                      : "water tank is full "
                  : "No infos has been set for this tank"}
              </p>
            </div>
          </PopUpMainElements>
          {/* <span id="checkPosts_title"> : حالة تدفق المياه حسب المستخدمين </span> */}
        </HeaderElements>
        <span id="checkPosts_title">
          {"Water flow state according to users reports :"}
        </span>
      </Header>
      {selectedTankData && selectedTankData.posts ? (
        <CheckPosts tankData={selectedTankData} />
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
              fontSize: "60px",
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
const Header = styled(Box)<{ backgroundColor: string }>`
  display: flex column;
  justify-content: space-between;
  padding: 10px 10px 0px 10px;
  /* background-color: ${GLOBAL_STYLE.colorBlueSweet}; */
  /* We set color depending on tank state */
  background-color: ${(props) =>
    // props.tankStatus === TankStatus.EMPTY
    //   ? customTheme.palette.background.redDark
    //   : props.tankStatus === TankStatus.HALFFUll
    //     ? customTheme.palette.background.yellowDark
    //     : customTheme.palette.background.blueDark};
    // getTankStatusColor(props.tank, "dark")};
    props.backgroundColor};

  /* box-shadow: rgba(0, 0, 0, 0.2) 0 1px 16px 0px; */
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 10px 0px;
  #checkPosts_title {
    color: ${() => customTheme.palette.background.defaultWhite};
  }
  position: fixed;
  z-index: 10;
  width: 100%;
`;
const HeaderElements = styled.div`
  display: flex column;
  /* margin: 20px 0; */
`;
const PopUpMainElements = styled.div`
  display: flex;
  /* If lang arab : */
  /* flex-direction: row-reverse; */
  align-items: center;
  margin: 10px 20px;

  #tank_icon {
    height: 70px;
    /* width: 70px; */
  }

  #tank_text {
    margin: 0 20px;
  }

  #tank_text p {
    margin: 2px;
    /* text-align: right; */
  }
  #tank_name {
    font-family: "lalezar";
    color: ${() => customTheme.palette.background.defaultWhite};
    font-size: 40px;
  }
  #tank_description {
    font-family: "changa";
    font-weight: 600;
    font-size: 18px;
  }
`;

export default Tank;
