import React, { useEffect, useState } from "react";
//MODELS
import TankStatus from "../models/utils/TankStatus";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

//DATA
import { postsProps, tankDataProps } from "./MapPage";
import { Button } from "@mui/material";
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

interface TankProps {
  tanksData: tankDataProps[];
  setCookie: (userIdTitle: any, userIdValue: any, option: any) => void;
  cookies: Object;
}

const Tank = (props: TankProps) => {
  const { tanksData, setCookie, cookies } = props;
  const navigateTo = useNavigate();

  // VARIABLES (STATES)
  const [selectedTankData, setSelectedTankData] = useState<tankDataProps>();
  const tankId: number = parseInt(useParams().id as string);
  const [tankStatus, setTankStatus] = useState<TankStatus>(TankStatus.UNKNOWN);
  // const idTank: Readonly<Params<string>> = useParams();

  const [isConfirmBoxVisible, setIsConfirmBoxVisible] =
    useState<boolean>(false);

  const [isAddPostAllowed, setIsAddPostAllowed] = useState<boolean>(false);

  useEffect(() => {
    const tankData = tanksData.find((tank: tankDataProps) => {
      return tank.id === tankId ?? null;
    });

    setSelectedTankData(tankData);
  }, [tankId, tanksData]);

  // METHODS
  const handleIsConfirmBoxVisible = (isConfirmBoxVisible: boolean) => {
    setIsConfirmBoxVisible(isConfirmBoxVisible);
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
      userType: UserType.RANDOM,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      weekDay: date.toLocaleDateString([], { weekday: "long" }),
      postTime: date.getTime(),
    };
    if (selectedTankData && newPostData) {
      alert("tank id : " + selectedTankData.id);
      setANewPost(selectedTankData?.id, newPostData);
      updateTankStatus(selectedTankData?.id, status);

      setIsConfirmBoxVisible(false);
      //Create a Uuid (unique id)
      let newUuid: string = crypto.randomUUID();
      setIsAddPostAllowed(false);
      // Add a cookie that contains the identifier of the user and the maxAge of his cookie (300s => 5min)
      setCookie("userId", newUuid, { path: "/", maxAge: 300 });
      let now = new Date().getTime();
      updateLastPostTime(tankId, now);
      let diffTime = Math.floor((now - selectedTankData.lastPostTime) / 1000);
      updateLastCheck(selectedTankData.id, diffTime);
    }
  };

  return (
    <div>
      <Header>
        <ArrowBox>
          <img
            src="/img/arrow.svg"
            alt=""
            onClick={() => navigateTo("/mapPage")}
          />
        </ArrowBox>
        <PopUpMainElements>
          <img
            id="tank_icon"
            alt=""
            src={
              selectedTankData?.status === TankStatus.EMPTY
                ? "/img/empty_tank.svg"
                : selectedTankData?.status === TankStatus.HALFFUll
                ? "/img/halffilled_tank.svg"
                : "/img/filled_tank.svg"
            }
          />
          <div id="tank_text">
            <p id="tank_name">{selectedTankData?.name}</p>
            <p id="tank_description">
              {selectedTankData?.status === TankStatus.EMPTY
                ? "الخزان فارغ"
                : selectedTankData?.status === TankStatus.HALFFUll
                ? "الخزان نصف ممتلئ"
                : selectedTankData?.status === TankStatus.FULL
                ? "الخزان ممتلئ"
                : "لم يسجل اي حالة لهذا الخزان"}
            </p>
          </div>
        </PopUpMainElements>
      </Header>
      {selectedTankData && <CheckPosts tankId={tankId} />}
      {selectedTankData && (
        <BottomNav
          setConfirmationBox={handleIsConfirmBoxVisible}
          tankLatLng={selectedTankData.latLng}
          setTankStatus={handleTankStatus}
          cookies={cookies}
          isAddPostAllowed={isAddPostAllowed}
          setIsAddPostAllowed={setIsAddPostAllowed}
        />
      )}
      {isConfirmBoxVisible && (
        <PopUp
          tankStatus={tankStatus}
          addPost={handleAddPost}
          setIsConfirmBoxVisible={handleIsConfirmBoxVisible}
        />
      )}
    </div>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;
const PopUpMainElements = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-right: 20px;

  #tank_icon {
    height: 70px;
    /* width: 70px; */
  }

  #tank_text {
    margin-right: 10px;
    width: 100%;
  }

  #tank_text p {
    margin: 2px;
    text-align: right;
  }
  #tank_name {
    font-family: "lalezar";
    color: teal;
    font-size: 34px;
  }
  #tank_description {
    font-family: "changa";
    font-weight: 600;
    font-size: 18px;
  }
`;

const ArrowBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  :hover {
    cursor: pointer;
  }
`;

export default Tank;
