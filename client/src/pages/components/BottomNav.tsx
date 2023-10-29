import { Button } from "@mui/material";
import { LatLng } from "leaflet";
import React, { useState } from "react";
import styled from "styled-components";
import { latLngProps } from "../MapPage";

const BottomNav = (tankLatLng: latLngProps) => {
  const [isAddPostInfosVisible, setIsAddPostInfosVisible] =
    useState<boolean>(false);
  const [isAddPostBtnsVisible, setIsAddPostBtnsVisible] =
    useState<boolean>(false);
  const [isPosInfosVisible, setIsPosInfosVisible] = useState<boolean>(false);

  const handleCheckTank = () => {
    console.log("Merdo");
    console.log("Navigator userAgent => ", navigator.userAgent);
    if (navigator.geolocation.getCurrentPosition) {
      alert("SUCCES navGeoLoc");
      navigator.geolocation.getCurrentPosition(
        (success) => {
          alert("SUCCES GetLoc");
          let latLng = new LatLng(
            success.coords.latitude,
            success.coords.longitude
          );
          if (latLng.lat) console.log("LatLng : ", latLng);
          // We test if the actual position is near the tank position (the value 0.01 is for test) :
          if (
            latLng.lat > tankLatLng.lat - 0.01 &&
            latLng.lat < tankLatLng.lat + 0.01 &&
            latLng.lng > tankLatLng.lng - 0.01 &&
            latLng.lng < tankLatLng.lng + 0.01
          ) {
            setIsAddPostInfosVisible(false);
            setIsPosInfosVisible(false);
            setIsAddPostBtnsVisible(true);
            alert("Done");
          } else {
            setIsAddPostInfosVisible(false);
            setIsPosInfosVisible(true);
            alert("U are far from tank");
            // Display : u have to be near the tank. Try to come closer
          }
        },
        (error) => {
          console.log("ERROR => ", error);
          alert("Unable to get your location");
          // TREAT ERROR TYPES
        }
      );
    } else {
      console.log("Geolocation not supported");
      alert("Geolocation not supported");
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

      {
        // POSITION INFOS : To display when the user is steal far from the tank
        isPosInfosVisible && (
          <PostBoxInfos>
            <h3>You are far from the tank</h3>
            <p>Come closer to the tank and try again</p>
            <button onClick={() => handleCheckTank()}>Try again</button>
          </PostBoxInfos>
        )
      }

      {
        // Display btns
        isAddPostBtnsVisible && (
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
        )
      }
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
