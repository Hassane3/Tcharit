import React, { useEffect, useState } from "react";
import { tankDataProps } from "../MapPage";
import TankStatus from "../../models/utils/TankStatus";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getDiffTime } from "../../utils/methods/methods";
import { EmptyTank, FullTank, HalfFullTank } from "../../utils/constants/Icons";
import { GLOBAL_STYLE } from "../../utils/constants/constants";

interface mapTankBoxProps {
  tank: tankDataProps;
  setVisitedTank: (arg: tankDataProps) => void;
  handleTimeFormat: (arg: number) => string;
}

const MapTankBox = (props: mapTankBoxProps) => {
  const { tank, setVisitedTank, handleTimeFormat } = props;
  const navigateTo = useNavigate();
  const [lastCheckTime, setLastCheckTime] = useState<number>();

  useEffect(() => {
    let lastPostTime: number = tank.lastPostTime;
    if (lastPostTime) {
      setLastCheckTime(getDiffTime(lastPostTime));
    }

    const checkPointInterval = setInterval(() => {
      setLastCheckTime(getDiffTime(lastPostTime));
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
    >
      <PopUpMainElements>
        {tank.status === TankStatus.EMPTY
          ? EmptyTank()
          : tank.status === TankStatus.HALFFUll
          ? HalfFullTank()
          : FullTank()}
        <div className="popUp_text">
          <p className="popUp_name">{tank.name}</p>
          <p className="popUp_description">
            {tank.status === TankStatus.EMPTY
              ? "الخزان فارغ"
              : tank.status === TankStatus.HALFFUll
              ? "الخزان نصف ممتلئ"
              : tank.status === TankStatus.FULL
              ? "الخزان ممتلئ"
              : "لم يسجل اي حالة لهذا الخزان"}
          </p>
        </div>
      </PopUpMainElements>
      <span className="popUp_lastCheck">
        {/* منذ {handleTimeFormat(marker.lastCheckTime)} دقيقة */}
        {lastCheckTime && handleTimeFormat(lastCheckTime)}
      </span>
    </PopUpBox>
  );
};

const PopUpBox = styled(Button)`
  display: flex;
  flex-direction: column;
  width: 100%;

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
    color: ${GLOBAL_STYLE.colorBrown};
    font-size: 34px;
  }
  .popUp_description {
    font-family: "changa";
    font-weight: 600;
    font-size: 18px;
  }
  .popUp_lastCheck {
    font-family: rubik;
    font-size: 16px;
    font-weight: 400;
    align-self: start;
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
