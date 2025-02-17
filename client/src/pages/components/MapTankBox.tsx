import React, { useEffect, useState } from "react";
import { postsProps, tankDataProps } from "../MapPage";
import TankStatus from "../../models/utils/TankStatus";
import styled from "styled-components";
import { Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { getDiffTime } from "../../utils/methods/methods";
import {
  EmptyTank,
  FullTank,
  HalfFullTank,
  UnsetTank,
} from "../../utils/constants/Icons";
import { GLOBAL_STYLE } from "../../utils/constants/constants";
import { PostBottomBox } from "../CheckPosts";
import { UserType } from "../../models/utils/UsersType";
import { customTheme } from "../../App";
import { getTankStatusColor } from "../Tank";

interface mapTankBoxProps {
  tank: tankDataProps;
  setVisitedTank: (arg: tankDataProps) => void;
  handleTimeFormat: (arg: number) => string;
}

const MapTankBox = (props: mapTankBoxProps) => {
  const { tank, setVisitedTank, handleTimeFormat } = props;
  const navigateTo = useNavigate();
  const [lastCheckTime, setLastCheckTime] = useState<number | null>();
  const [lastPost, setLastPost] = useState<postsProps | null>();

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
    <PopUpBox
      onClick={(e) => {
        setVisitedTank(tank);
        navigateTo("/tank/" + tank.id);
      }}
      fontColor={customTheme.palette.background.defaultBrown}
    >
      <PopUpMainElements>
        {lastPost
          ? lastPost.status === TankStatus.EMPTY
            ? EmptyTank()
            : lastPost.status === TankStatus.HALFFUll
              ? HalfFullTank()
              : FullTank()
          : UnsetTank()}

        <div className="popUp_text">
          <p className="popUp_name">{tank.name}</p>
          <p
            className="popUp_description"
            style={{ color: customTheme.palette.background.defaultBrown }}
          >
            {lastPost
              ? lastPost.status === TankStatus.EMPTY
                ? "الخزان فارغ"
                : lastPost.status === TankStatus.HALFFUll
                  ? "الخزان نصف ممتلئ"
                  : "الخزان ممتلئ"
              : "لم يسجل اية حالة لهذا الخزان"}
          </p>
        </div>
      </PopUpMainElements>

      <PostBottomBox textColor={customTheme.palette.background.blueDark}>
        <span>
          {/* {lastCheckTime && handleTimeFormat(lastCheckTime)} */}
          {lastCheckTime && handleTimeFormat(lastCheckTime)}
        </span>
        {/* A changer ! */}
        {lastPost && lastPost.userType === UserType.TANKAGENT && (
          <span>
            trusted
            <CheckIcon />
          </span>
        )}
      </PostBottomBox>
    </PopUpBox>
  );
};

const PopUpBox = styled(Button)<{ fontColor: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* max-width: 100%; */

  .popUp_icon {
    height: 70px;
    /* width: 70px; */
  }

  .popUp_text {
    margin-right: 10px;
    width: 100%;
  }

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

const PopUpMainElements = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 10px;
`;

export default MapTankBox;
