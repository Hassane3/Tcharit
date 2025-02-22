import React, { useEffect, useState } from "react";
import { postsProps, tankDataProps } from "../MapPage";
import TankStatus from "../../models/utils/TankStatus";
import styled from "styled-components";
import { Button, IconButton, Typography } from "@mui/material";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
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
import { customTheme } from "../../App";

interface mapTankBoxProps {
  tank: tankDataProps;
  favorites: Array<string> | undefined;
  setVisitedTank: (arg: tankDataProps) => void;
  handleTimeFormat: (arg: number) => string;
  handleFavorites: (tankId: number) => void;
}

const MapTankBox = (props: mapTankBoxProps) => {
  const { tank, favorites, setVisitedTank, handleTimeFormat, handleFavorites } =
    props;
  const navigateTo = useNavigate();
  const [lastCheckTime, setLastCheckTime] = useState<number | null>();
  const [lastPost, setLastPost] = useState<postsProps | null>();
  const [isFavorite, setIsFavorite] = useState<boolean>(
    favorites?.includes(tank.id.toString()) ? true : false
  );

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "4px",
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
          variant="h2"
          color={
            lastPost
              ? customTheme.palette.background.defaultBlue
              : customTheme.palette.background.greyLight
          }
        >
          {tank.name}
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
            margin: "0 4px 10px 4px",
          }}
        >
          <p
            className="popUp_description"
            style={{
              paddingRight: "14px",
              maxWidth: "170px",
              textAlign: "right",
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
                ? "الخزان فارغ"
                : lastPost.status === TankStatus.HALFFUll
                  ? "الخزان نصف ممتلئ"
                  : "الخزان ممتلئ"
              : "لم يسجل اية حالة لهذا الخزان"}
          </p>
          {lastPost
            ? lastPost.status === TankStatus.EMPTY
              ? EmptyTank()
              : lastPost.status === TankStatus.HALFFUll
                ? HalfFullTank()
                : FullTank()
            : UnsetTank()}
        </div>
        <PostBottomBox textColor={customTheme.palette.background.greyLight}>
          <span>{lastCheckTime && handleTimeFormat(lastCheckTime)}</span>
          {/* A changer ! */}
          {lastPost && lastPost.userType === UserType.TANKAGENT && (
            <span>
              trusted
              <CheckIcon sx={{ fontSize: "16px" }} />
            </span>
          )}
        </PostBottomBox>
      </PopUpMainElements>
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
const PopUpMainElements = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 !important;
`;

export default MapTankBox;
