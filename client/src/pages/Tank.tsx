import React, { useEffect, useState, Suspense, useMemo } from "react";
//MODELS
import TankStatus from "../models/utils/TankStatus";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

//DATA
import { postsProps, tankDataProps } from "./MapPage";
import BottomNav from "./components/BottomNav";
import PopUp from "./components/PopUp";
import {
  setANewPost,
  updateLastCheck,
  updateLastPostTime,
} from "../firebase/operations";
import { UserType } from "../models/utils/UsersType";
import {
  ArrowBack,
  Close,
  EmptyTank,
  FullTank,
  HalfFullTank,
  Infos,
  UnsetTank,
} from "../utils/constants/Icons";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CommentsDisabledRoundedIcon from "@mui/icons-material/CommentsDisabledRounded";
import { customTheme, UserData } from "../App";
import { Global } from "@emotion/react";
import SwipeableBox from "./components/SwipeableBox";
// UI
import { lazyWithDelay } from "../utils/ui/Skeleton";
import { SkeletonCheckPosts } from "../utils/ui/Skeleton";
import { useTranslation } from "react-i18next";
import UseSnackBar from "./components/UseSnackBar";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { db } from "../firebase/firebase";
import CheckPosts from "./CheckPosts";
import { getDiffTime } from "../utils/methods/methods";
interface TankProps {
  tanksData: tankDataProps[];
  setCookie: (userIdTitle: any, userIdValue: any, option: any) => void;
  cookies: Object;
  user: {} | null;
  userData: UserData;
}

const Tank = (props: TankProps) => {
  const { tanksData, setCookie, cookies, user, userData } = props;
  const navigateTo = useNavigate();

  // VARIABLES
  const [selectedTankData, setSelectedTankData] = useState<tankDataProps>();
  const tankId: number = parseInt(useParams().id as string);
  const [tankStatus, setTankStatus] = useState<TankStatus>(TankStatus.UNKNOWN);
  // const idTank: Readonly<Params<string>> = useParams();

  const [isConfirmBoxOpen, setIsConfirmBoxOpen] = useState<boolean>(false);

  const [isAddPostAllowed, setIsAddPostAllowed] = useState<boolean>(false);
  const [openBottomNav, setOpenBottomNav] = useState<boolean>(false);
  const [lastPost, setLastPost] = useState<postsProps | null>();
  const [isTankInfosOpen, setIsTankInfosOpen] = useState<boolean>(false);

  // MUI SnackBar
  const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  // const lastPost =
  //   selectedTankData &&
  //   selectedTankData.posts &&
  //   Object.values(selectedTankData.posts).at(-1);

  const headerLarge = 170;
  const headerTight = 70;
  const [headerHeight, setHeaderHeight] = useState<number>(headerLarge);
  const waveHeight =
    lastPost?.status === "EMPTY"
      ? -100
      : lastPost?.status === "HALF_FULL"
        ? -headerHeight * 0.5
        : -headerHeight * 0.1;

  const { t } = useTranslation();
  const lang = localStorage.getItem("language");

  useEffect(() => {
    const tankData = tanksData.find((tank: tankDataProps) => {
      return tank.id === tankId;
    });

    if (tankData?.id !== selectedTankData?.id) {
      setSelectedTankData(tankData);
    }
  }, [tankId, tanksData]);

  const [postsData, setPostsData] = useState<Array<postsProps>>([]);
  useEffect(() => {
    let posts: Array<postsProps> = [];
    if (selectedTankData) {
      const dbRef = ref(db, "tanks/" + selectedTankData.id + "/posts");

      return onValue(dbRef, (snapshot: DataSnapshot) => {
        posts = [];
        snapshot.forEach((post: any) => {
          posts.push({ id: post.key, ...post.val() });
        });
        setPostsData(posts);
      });
    }
  }, [selectedTankData]);

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
      // alert("tank id : " + selectedTankData.id);
      try {
        setANewPost(selectedTankData?.id, newPostData);
        setIsConfirmBoxOpen(false);
        //Create a Uuid (unique id)
        let newUuid: string = crypto.randomUUID();
        setIsAddPostAllowed(false);
        // Add a cookie that contains the identifier of the user and the maxAge of his cookie (300s => 5min)
        setCookie("userId", newUuid, { path: "/", maxAge: 300 });
        let now = new Date().getTime();
        updateLastPostTime(tankId, now);
        let diffTime = Math.floor((now - selectedTankData.lastPostTime) / 1000);
        updateLastCheck(selectedTankData.id, diffTime);
        setOpenBottomNav(false);
        setLastPost(newPostData);
        setIsSnackOpen(true);
        setSnackMessage(t("common.post.confirm_add"));
      } catch (error) {
        alert(t("errors.someting_went_wrong"));
        setIsConfirmBoxOpen(false);
        setIsSnackOpen(true);
        setSnackMessage(t("common.post.confirm_fail_add"));
      }

      // updateTankStatus(selectedTankData?.id, status);
    }
  };

  //  Handle header height while scrolling
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

  useEffect(() => {
    if (postsData.length != 0) {
      const latest = Object.values(postsData).at(-1);
      setLastPost(latest);
    } else {
      setLastPost(null); // in case posts are removed or not available
    }
  }, [postsData]);

  const CheckPosts = useMemo(
    () => lazyWithDelay(() => import("./CheckPosts"), 1000),
    []
  );

  return (
    <Page
      style={
        // We take the lastPost
        {
          backgroundColor: lastPost
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
      <Header headerHeight={headerHeight}>
        <div
          className={
            selectedTankData &&
            getDiffTime(selectedTankData.lastTimeFilled) < 110000
              ? "glowOn"
              : ""
          }
          style={{
            // backgroundColor: customTheme.palette.background.blue,
            boxShadow: "rgba(0, 0, 0, 0.2) 0 1px 10px 0px",
            borderRadius: "0 0 30px 30px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <HeaderElements
            headerHeight={headerHeight}
            backgroundColor={customTheme.palette.background.defaultWhite}
            style={{
              transition: "height 0.2s ease-in-out",
            }}
          >
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
                onClick={() => navigateTo(-1)}
                sx={{ padding: 0 }}
              >
                <ArrowBack
                  backgroundColor={customTheme.palette.background.defaultBlue}
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
                  color={customTheme.palette.background.defaultBlue}
                  style={{ textWrap: "nowrap" }}
                >
                  {lang === "ar"
                    ? selectedTankData?.arab_name
                    : selectedTankData?.latin_name}
                </Typography>
                {headerHeight > headerTight && (
                  <Typography
                    variant="h4"
                    id="tank_description"
                    style={
                      selectedTankData && {
                        color: lastPost
                          ? getTankStatusColor(lastPost, "basic")
                          : customTheme.palette.background.greyLight,
                        textWrap: "nowrap",
                      }
                    }
                  >
                    {lastPost
                      ? lastPost?.status === TankStatus.EMPTY
                        ? t("common.tank.tank_status.tank_is_empty")
                        : lastPost?.status === TankStatus.HALFFUll
                          ? t("common.tank.tank_status.tank_is_halfFull")
                          : t("common.tank.tank_status.tank_is_full")
                      : t("common.tank.tank_status.tank_is_unset")}
                  </Typography>
                )}
              </div>
              {lastPost ? (
                lastPost?.status === TankStatus.EMPTY ? (
                  <EmptyTank />
                ) : lastPost?.status === TankStatus.HALFFUll ? (
                  <HalfFullTank />
                ) : (
                  <FullTank />
                )
              ) : (
                <UnsetTank />
              )}
            </PopUpMainElements>
          </HeaderElements>

          {headerHeight > headerTight &&
            selectedTankData &&
            getDiffTime(selectedTankData.lastTimeFilled) < 110000 && (
              <HeaderBottomBox
                style={{
                  zIndex: 2,
                }}
              >
                <Typography
                  variant="h6"
                  color={customTheme.palette.background.defaultWhite}
                >
                  ملئ قبل 25 دقيقة
                </Typography>
              </HeaderBottomBox>
            )}
        </div>
        {/* WAVES */}
        {/* <div
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
          > */}
        {/* <div
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
            </div> */}
        {/* </div>
        </div> */}

        {headerHeight > headerTight && (
          <div
            style={{
              display: "flex",
              flexDirection: lang === "ar" ? "row-reverse" : "row",
              alignItems: "center",
              margin: "0 8px",
            }}
          >
            <IconButton onClick={() => setIsTankInfosOpen(true)}>
              <Infos
                backgroundColor={customTheme.palette.background.defaultBlue}
              />
            </IconButton>

            <span
              style={{
                color: customTheme.palette.background.defaultBlue,
                margin: "0 4px",
                fontSize: "12px",
              }}
            >
              {t("common.tank.tank_page_infos#0")}
            </span>
          </div>
        )}
      </Header>

      {/* Informations */}
      <ModalContainer
        open={isTankInfosOpen}
        onClose={() => setIsTankInfosOpen(false)}
      >
        <BoxContainer
          backgroundColor={customTheme.palette.background.defaultWhite}
        >
          <Button
            onClick={() => setIsTankInfosOpen(false)}
            sx={{
              minWidth: "unset",
              position: "absolute",
              top: 20,
              right: 20,
              padding: 0,
              color: customTheme.palette.background.defaultBlue,
            }}
          >
            <Close
              backgroundColor={customTheme.palette.background.defaultBlue}
            />
            {/* <CloseRoundedIcon fontSize="large" /> */}
          </Button>
          <div>
            <Infos
              backgroundColor={customTheme.palette.background.defaultBlue}
              width={40}
              height={40}
            />
            <Typography
              variant="body2"
              style={{ textAlign: lang === "ar" ? "end" : "start" }}
            >
              {t("common.tank.tank_page_infos#1")}
            </Typography>
            <Typography
              variant="body2"
              style={{ textAlign: lang === "ar" ? "end" : "start" }}
            >
              {t("common.tank.tank_page_infos#2")}
            </Typography>
          </div>
        </BoxContainer>
      </ModalContainer>

      {postsData.length === 0 ? (
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
            {t("common.tank.tank_status.tank_is_unset")}
          </Typography>
        </div>
      ) : (
        selectedTankData && (
          <Suspense fallback={<SkeletonCheckPosts />}>
            <CheckPosts
              postsData={postsData}
              tankData={selectedTankData}
              user={user}
            />
          </Suspense>
        )
      )}

      {selectedTankData && (
        <SwipeableBox
          navLabel={t("common.tank.report_water_flow")}
          openBottomNav={openBottomNav}
          setOpenBottomNav={setOpenBottomNav}
        >
          <BottomNav
            selectedTankData={selectedTankData}
            setConfirmationBox={handleConfirmationBox}
            tankLatLng={selectedTankData.latLng}
            openBottomNav={openBottomNav}
            setOpenBottomNav={setOpenBottomNav}
            // setTankStatus={handleTankStatus}
            cookies={cookies}
            isAddPostAllowed={isAddPostAllowed}
            setIsAddPostAllowed={setIsAddPostAllowed}
            userData={userData}
          />
        </SwipeableBox>
      )}
      {openBottomNav && (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: "#000",
            opacity: 0.3,
          }}
        ></div>
      )}
      {isConfirmBoxOpen && (
        <PopUp
          tankStatus={tankStatus}
          isConfirmBoxOpen={isConfirmBoxOpen}
          addPost={handleAddPost}
          setConfirmationBox={handleConfirmationBox}
        />
      )}
      <UseSnackBar
        isSnackOpen={isSnackOpen}
        setIsSnackOpen={setIsSnackOpen}
        snackMessage={snackMessage}
      />
    </Page>
  );
};

export const getTankStatusColor = (
  // tank: tankDataProps | undefined,
  lastPost: postsProps | null,
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
const Header = styled(Box)<{ headerHeight: number }>`
  position: fixed;
  z-index: 10;
  width: 100%;
  height: ${(props) => props.headerHeight + "px"};
  #checkPosts_title {
    color: ${() => customTheme.palette.background.defaultWhite};
  }

  .glowOn:before {
    z-index: 1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(45deg, #64ede4, #c8bea7, #64ede4);
    animation: glowing 10s linear infinite;
    background-size: 400%;
    transition: opacity 0.3s ease-in-out;
    align-self: center;
    justify-self: center;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  @keyframes glowing {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 400% 0;
    }
    100% {
      background-position: 0 0;
    }
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
const HeaderElements = styled.div<{
  headerHeight: number;
  backgroundColor: string;
}>`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: ${(props) => (props.headerHeight < 170 ? "center" : "unset")};
  flex-direction: ${(props) => (props.headerHeight < 170 ? "row" : "column")};
  background-color: ${(props) => props.backgroundColor};
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 10px 0px;
  width: 100%;
  padding: 10px;
  border-radius: 0 0 30px 30px;
  overflow: hidden;
  z-index: 2;
`;
const PopUpMainElements = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 0 10px;

  #tank_texts {
    margin: 0 20px;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  }

  #tank_text p {
    margin: 2px;
  }
  #tank_description {
    font-family: "changa";
    font-weight: 600;
  }
`;

const HeaderBottomBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 6px;
  position: relative;
`;

export const ModalContainer = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const BoxContainer = styled(Box)<{
  backgroundColor?: string;
}>`
  margin: 40px;
  padding: 20px;
  border-radius: 30px;
  width: 90%;
  height: 80%;
  background-color: ${(props) => props.backgroundColor};
  text-align: center;
  display: flex;
  justify-content: center;
  position: relative;

  > div {
    display: grid;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    align-content: center;
  }
  div > * {
    margin: 10px;
  }
`;

export default Tank;
