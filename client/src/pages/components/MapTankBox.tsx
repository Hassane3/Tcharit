import React, { HtmlHTMLAttributes, Ref, useEffect, useState } from "react";
import { postsProps, tankDataProps } from "../MapPage";
import TankStatus from "../../models/utils/TankStatus";
import styled from "styled-components";
import { Button, IconButton, Typography } from "@mui/material";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { getDiffTime } from "../../utils/methods/methods";
import {
  EmptyTank,
  FullTank,
  HalfFullTank,
  UnsetTank,
} from "../../utils/constants/Icons";
import { PostBottomBox } from "../CheckPosts";
import { UserType } from "../../models/utils/UsersType";
import { customTheme, UserData } from "../../App";
import { useTranslation } from "react-i18next";
import { deleteTank } from "../../firebase/operations";
import UseSnackBar from "./UseSnackBar";

interface mapTankBoxProps {
  tank: tankDataProps;
  user: {} | null;
  userData: UserData;
  favorites: Array<string> | undefined;
  setVisitedTank: (arg: tankDataProps) => void;
  handleTimeFormat: (arg: number) => [any, string?];
  handleFavorites: (tankId: number) => void;
}

const MapTankBox = (props: mapTankBoxProps) => {
  const {
    tank,
    user,
    userData,
    favorites,
    setVisitedTank,
    handleTimeFormat,
    handleFavorites,
  } = props;

  const navigateTo = useNavigate();
  const { t } = useTranslation();

  const [lastCheckTime, setLastCheckTime] = useState<number | null>();
  const [lastPost, setLastPost] = useState<postsProps | null>();
  const [isFavorite, setIsFavorite] = useState<boolean>(
    favorites?.includes(tank.id.toString()) ? true : false
  );

  // MUI SnackBar
  const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  const lang = localStorage.getItem("language");

  const handleSetTankFav = (isFavorite: boolean) => {
    setIsFavorite(!isFavorite);
    handleFavorites(tank.id);
  };

  useEffect(() => {
    if (tank.posts) {
      console.log("last post >", Object.values(tank.posts).at(-1));
      // We get the last post of the tank and retrieve its postTime
      let lastPost: any = Object.values(tank.posts).at(-1);
      setLastPost(lastPost);
      setLastCheckTime(getDiffTime(lastPost.postTime));
    } else {
      setLastPost(null);
      setLastCheckTime(null);
    }
    // We repeat the same thing in the setInterval
    const checkPointInterval = setInterval(() => {
      if (tank.posts) {
        let lastPost: any = Object.values(tank.posts).at(-1);
        setLastPost(lastPost);
        setLastCheckTime(getDiffTime(lastPost.postTime));
      } else {
        setLastPost(null);
        setLastCheckTime(null);
      }
      // Timer 2min in ms
    }, 120000);

    return () => {
      clearInterval(checkPointInterval);
    };
  }, []);

  const handleDeleteCistern = (tankId: number) => {
    const confirm = window.confirm(
      t("common.mapPage.tempo_cistern.confirm_delete")
    );
    if (confirm) {
      try {
        deleteTank(tankId);
        setSnackMessage(t("common.mapPage.tempo_cistern.confirm_delete"));
        setIsSnackOpen(true);
      } catch (error) {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "inherit",
        width: "inherit",
      }}
    >
      <div
        className={getDiffTime(tank.lastTimeFilled) < 110000 ? "glowOn" : ""}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "inherit",
            height: "inherit",
            padding: "4px",
            backgroundColor: customTheme.palette.background.defaultWhite,
            borderRadius: "0 0 10px 10px",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <PopUpTop>
            <IconButton
              sx={{ m: 0, p: 0, zIndex: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                handleSetTankFav(isFavorite);
              }}
            >
              {isFavorite ? (
                <StarRoundedIcon
                  style={{ color: customTheme.palette.background.blue }}
                />
              ) : (
                <StarOutlineRoundedIcon
                  style={{ color: customTheme.palette.background.lightWhite }}
                />
              )}
            </IconButton>
            <Typography
              variant="h3"
              color={
                lastPost
                  ? customTheme.palette.background.defaultBlue
                  : customTheme.palette.background.greyLight
              }
            >
              {lang === "ar" ? tank.arab_name : tank.latin_name}
            </Typography>
          </PopUpTop>
          <PopUpMainElements
            onClick={(e) => {
              setVisitedTank(tank);
              navigateTo("/tank/" + tank.id);
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "10px",
              }}
            >
              {lastPost
                ? lastPost.status === TankStatus.EMPTY
                  ? EmptyTank()
                  : lastPost.status === TankStatus.HALFFUll
                    ? HalfFullTank()
                    : FullTank()
                : UnsetTank()}
              <p
                className="popUp_description"
                style={{
                  flex: 1,
                  padding: "0 14px",
                  maxWidth: "170px",
                  textAlign: "left",
                  textTransform: "initial",
                  color: lastPost
                    ? lastPost.status === TankStatus.EMPTY
                      ? customTheme.palette.background.red
                      : lastPost.status === TankStatus.HALFFUll
                        ? customTheme.palette.background.yellow
                        : customTheme.palette.background.blue
                    : customTheme.palette.background.greyLight,
                }}
              >
                {lastPost
                  ? lastPost.status === TankStatus.EMPTY
                    ? t("common.tank.tank_status.tank_is_empty")
                    : lastPost.status === TankStatus.HALFFUll
                      ? t("common.tank.tank_status.tank_is_halfFull")
                      : t("common.tank.tank_status.tank_is_full")
                  : t("common.tank.tank_status.tank_is_unset")}
              </p>
            </div>
            <PostBottomBox textColor={customTheme.palette.background.greyLight}>
              <span>
                {/* {lastCheckTime && handleTimeFormat(lastCheckTime)} */}
                {lang === "ar" ? (
                  lastCheckTime &&
                  handleTimeFormat(lastCheckTime)
                    .reverse()
                    .map((time: string, index: number) => (
                      <span key={index}>{time}&nbsp;</span>
                    ))
                ) : (
                  <span>
                    {lastCheckTime &&
                      handleTimeFormat(lastCheckTime).map(
                        (time: string, index: number) => (
                          <span key={index}>{time}&nbsp;</span>
                        )
                      )}
                  </span>
                )}
              </span>
              {/* A changer ! */}
              {lastPost && lastPost.userType === UserType.TANKAGENT && (
                <span>
                  <span>{t("common.info.trusted")}</span>
                  <CheckIcon sx={{ fontSize: "16px" }} />
                </span>
              )}
            </PostBottomBox>
          </PopUpMainElements>
        </div>
        {getDiffTime(tank.lastTimeFilled) < 110000 && (
          <PopUpBottom>
            <Typography
              variant="h6"
              color={customTheme.palette.background.defaultWhite}
            >
              ملئ قبل 25 دقيقة
            </Typography>
          </PopUpBottom>
        )}
      </div>
      {/* For Temporary cisterns */}
      {user && tank.tankAgentId === userData.id && (
        <PopUpSide
          style={{
            backgroundColor: customTheme.palette.background.yellowExtraLight,
          }}
        >
          <Button onClick={() => handleDeleteCistern(tank.id)} size="large">
            <DeleteOutlineRoundedIcon
              sx={{
                color: customTheme.palette.background.red,
                fontSize: "30px",
              }}
            />
          </Button>
        </PopUpSide>
      )}

      <UseSnackBar
        isSnackOpen={isSnackOpen}
        setIsSnackOpen={setIsSnackOpen}
        snackMessage={snackMessage}
      />
    </div>
  );
};

const PopUpBox = styled(Button)<{ fontColor: string }>`
  .popUp_text p {
    margin: 2px;
    text-align: right;
  }
  .popUp_name {
    font-family: "lalezar";
    color: ${(props) => props.fontColor};
    font-size: 34px;
  }
  .popUp_description {
    font-family: "changa";
    font-weight: 600;
    font-size: 18px;
  }
  .leaflet-popup-content {
    margin: 0;
  }
`;
const PopUpTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;
const PopUpSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const PopUpBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 6px;
  z-index: 1;
`;
const PopUpMainElements = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 !important;
`;

export default MapTankBox;
