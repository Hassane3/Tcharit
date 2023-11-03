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
import { postsProps, tankDataProps, tanksDataProps } from "./MapPage";
import { Button } from "@mui/material";
import { LatLng } from "leaflet";
import CheckPosts from "./CheckPosts";
import BottomNav from "./components/BottomNav";
import PopUp from "./components/PopUp";
import { setANewPost } from "../firebase/operations";
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
  // console.log("tankRef : ", tankRef);
  const [tankStatus, setTankStatus] = useState<TankStatus>(TankStatus.UNKNOWN);
  // const idTank: Readonly<Params<string>> = useParams();

  const [isConfirmBoxVisible, setIsConfirmBoxVisible] =
    useState<boolean>(false);
  // const [newPostData, setNewPostData] = useState<postsProps>();
  const [userUuid, setUserUuid] = useState<string>("");
  const [isAddPostAllowed, setIsAddPostAllowed] = useState<boolean>(false);

  useEffect(() => {
    console.log("idTank : ", tankId);
    const tankData = tanksData.find((tank: tankDataProps) => {
      return tank.id === tankId ?? null;
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
  }, [tankId, tanksData]);

  // METHODS
  const handleIsConfirmBoxVisible = (isConfirmBoxVisible: boolean) => {
    setIsConfirmBoxVisible(isConfirmBoxVisible);
  };

  const handleTankStatus = (tankStatus: TankStatus) => {
    setTankStatus(tankStatus);
  };

  const uuidFromCrypto = () => {
    let newUuid: string = crypto.randomUUID();
    setUserUuid(newUuid);
    console.log("UUID : ", newUuid);
  };
  const handleAddPost = () => {
    //create a post
    // Add a new post on db :
    let newPostData: postsProps = {
      status: tankStatus,
      userType: UserType.RANDOM,
      date: 0,
      time: 9,
    };
    // setNewPostData({

    // });
    // I hav to click a second time to get refreshed data !!!
    console.log("selectedTankData => ", selectedTankData);
    if (selectedTankData && newPostData) {
      alert("tank id : " + selectedTankData.id);
      setANewPost(selectedTankData?.id, newPostData);
      // Close the popUp
      setIsConfirmBoxVisible(false);
      // Add a cookie that contains the identifier of the user and the time of his last post.
      // set the cookie with
      //Create a Uuid (unique id)
      uuidFromCrypto();
      setCookie("userId", "KoV", { path: "/", maxAge: 15 });
      setIsAddPostAllowed(false);
      // setCookie("access_token", "1", { path: "/" });
      // createCookie(`${uuid}`, `${Date()}`)
    }
  };

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
        tankId={tankId}
        // posts={selectedTankData && selectedTankData.posts}
        // posts={() => {
        //   const posts = tanksData.data.flatMap((tank) => {
        //     return tank.posts;
        //   });

        //   return posts;
        // }}
      />
      {selectedTankData && (
        <BottomNav
          // lat={selectedTankData.latLng.lat}
          // lng={selectedTankData.latLng.lng}
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
