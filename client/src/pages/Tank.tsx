import React, { useEffect, useState } from "react";
//MODELS
import TankStatus from "../models/utils/TankStatus";
import { Navigate, Params, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  DataSnapshot,
} from "firebase/database";
//DATA
import { db } from "../firebase/firebase";
import { tankDataProps, tanksDataProps } from "./MapPage";
import { Button } from "@mui/material";
import { LatLng } from "leaflet";
import CheckPosts from "./CheckPosts";
import BottomNav from "./components/BottomNav";

const Tank = (tanksData: tanksDataProps) => {
  const navigateTo = useNavigate();
  const [selectedTankData, setSelectedTankData] = useState<tankDataProps>();

  // const idTank: Readonly<Params<string>> = useParams();
  const idTank: number = parseInt(useParams().id as string);
  // console.log("tankRef : ", tankRef);
  useEffect(() => {
    console.log("idTank : ", idTank);
    const tankData = tanksData.data.find((tank: tankDataProps) => {
      return tank.id === idTank ?? null;
      // console.log("tank ))> ", tank);
    });
    console.log("tankData : ", tankData);
    console.log("posts-length", tankData?.posts?.length);
    setSelectedTankData(tankData);
    // const tankRef = ref(db, "tanks/" + idTank.id);
    // return onValue(tankRef, (snapshot: DataSnapshot) => {
    //   if (idTank.id) {
    //     setselectedTankData(snapshot.child(idTank.id).val());
    //   }
    // });
  }, [idTank, tanksData.data]);
  const posts = selectedTankData?.posts;
  console.log("posts --> ", posts);
  console.log("posts-lenght", posts?.length);
  // Ma position ===> lat: 43.296482, lng: 5.36978

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
      <CheckPosts
        posts={selectedTankData && selectedTankData.posts}
        // posts={() => {
        //   const posts = tanksData.data.flatMap((tank) => {
        //     return tank.posts;
        //   });

        //   return posts;
        // }}
      />
      <BottomNav />
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
