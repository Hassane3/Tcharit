import { Button } from "@mui/material";
import { LatLng } from "leaflet";
import React, { useState } from "react";
import styled from "styled-components";

const BottomNav = () => {
  const [isAddPostInfosVisible, setIsAddPostInfosVisible] = useState(Boolean);
  const [isAddPostBoxVisible, setIsAddPostBtnVisible] = useState(Boolean);

  const handleCheckTank = () => {
    console.log("Merdo");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (success) => {
          console.log("SUCCES");
          let latLng = new LatLng(
            success.coords.latitude,
            success.coords.longitude
          );
          if (latLng.lat) console.log("LatLng : ", latLng);
          setIsAddPostBtnVisible(true);
          setIsAddPostInfosVisible(false);
        },
        (error) => {
          console.log("ERROR => ", error);
          alert("Unable to get your location");
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  };
  return (
    <Container>
      <span onClick={() => setIsAddPostInfosVisible(true)}>Add post</span>

      {isAddPostInfosVisible && (
        <PostBoxInfos>
          <button onClick={() => setIsAddPostInfosVisible(false)}>close</button>
          <h3>Add post</h3>
          <p>To be sure that infos are trusted,...</p>
          <span>posts are checked...</span>
          <button
            onClick={
              () => handleCheckTank()
              //   setIsAddPostBtnVisible(true);
              //   setIsAddPostInfosVisible(false);
            }
          >
            Continu
          </button>
        </PostBoxInfos>
      )}

      {isAddPostBoxVisible && (
        <FlowButtons>
          <FlowButton
            //   "EMPTY"
            id="null"
            onClick={() => {
              //   handleCheckTank();
              // I verify if the user is near the tank (geoloc ?);
              // We add an object to the object "checks" (date, heure, status, userType)
              // display : u have to be near the tank to be able to give tank state
            }}
          >
            <img src="/img/null_flow.svg" alt="" />
            <span>منعدم</span>
          </FlowButton>
          <FlowButton id="low">
            <img src="/img/low_flow.svg" alt="" />
            <span>ضئيل</span>
          </FlowButton>
          <FlowButton id="high">
            <img src="/img/high_flow.svg" alt="" />
            <span>قوي</span>
          </FlowButton>
        </FlowButtons>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* height: 100px; */
  max-height: 140px;
  border-radius: 14px 14px 0 0;
`;

const FlowButtons = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100vw;
`;
const FlowButton = styled(Button)`
  display: flex;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100%;

  img {
    width: 54px;
  }
  span {
    font-size: 20px;
  }
  #null {
    background-color: #3876ac;
  }

  #low {
    background-color: #8f8b69;
  }

  #high {
    background-color: #72d0f2;
  }
`;

const PostBoxInfos = styled.div`
  background-color: teal;
  height: 20%;
  width: 100%;
`;

export default BottomNav;
