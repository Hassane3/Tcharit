import { Button } from "@mui/material";
import { LatLng } from "leaflet";
import React, { useState } from "react";
import styled from "styled-components";
import { latLngProps } from "../MapPage";
import TankStatus from "../../models/utils/TankStatus";
import { GLOBAL_STYLE } from "../../utils/constants/constants";

interface BottomNavProps {
  tankLatLng: latLngProps;
  setConfirmationBox: (arg: boolean) => void;
  setTankStatus: (tankStatus: TankStatus) => void;
  cookies: any;
  isAddPostAllowed: boolean;
  setIsAddPostAllowed: (arg: boolean) => void;
}

const BottomNav = (props: BottomNavProps): JSX.Element => {
  const {
    setConfirmationBox,
    setTankStatus,
    tankLatLng,
    cookies,
    isAddPostAllowed,
    setIsAddPostAllowed,
  } = props;

  const [isAddPostInfosVisible, setIsAddPostInfosVisible] =
    useState<boolean>(false);
  const [isAddPostBtnsVisible, setIsAddPostBtnsVisible] =
    useState<boolean>(false);
  const [isPosInfosVisible, setIsPosInfosVisible] = useState<boolean>(false);

  const handleCheckTank = () => {
    if (navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(
        (success) => {
          let latLng = new LatLng(
            success.coords.latitude,
            success.coords.longitude
          );
          // We test if the actual position is near the tank position (the value 0.01 is for test, 0.0001 for high precision) :
          // alert(
          //   "lat : " +
          //     latLng.lat +
          //     "lng :" +
          //     latLng.lng +
          //     "\n" +
          //     "tank lat : " +
          //     tankLatLng.lat +
          //     "tank lng :" +
          //     tankLatLng.lng
          // );

          if (
            //
            latLng.lat > tankLatLng.lat - 0.001 &&
            latLng.lat < tankLatLng.lat + 0.001 &&
            latLng.lng > tankLatLng.lng - 0.001 &&
            latLng.lng < tankLatLng.lng + 0.001
          ) {
            setIsAddPostInfosVisible(false);
            setIsPosInfosVisible(false);
            setIsAddPostBtnsVisible(true);
          } else {
            setIsAddPostInfosVisible(false);
            setIsPosInfosVisible(true);
            alert("U are far from tank ! `\t` Try to come closer");
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
      <PostBox
        onClick={() => {
          if (cookies.userId) {
            alert(
              "Vous ne pouvez ajouter un post car venez de le faire. Pour pouvoir ajouter un post de nouveau, il faut attendre unpeu et puis rafraichir la page"
            );
          } else {
            setIsAddPostAllowed(true);
            setIsAddPostInfosVisible(true);
          }
        }}
      >
        <span>Add post</span>
      </PostBox>

      {isAddPostInfosVisible && (
        <PostBoxInfos>
          <button onClick={() => setIsAddPostInfosVisible(false)}>close</button>
          <p>To be sure that infos are trusted,...</p>
          <span>posts are checked...</span>
          <button onClick={() => handleCheckTank()}>Continu</button>
        </PostBoxInfos>
      )}

      {
        // POSITION INFOS : To display when the user is still far from the tank
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
        isAddPostAllowed && isAddPostBtnsVisible && (
          <FlowButtons>
            <FlowButton
              //   "EMPTY"
              id="dryFlow"
              onClick={() => {
                setConfirmationBox(true);
                setTankStatus(TankStatus.EMPTY);
              }}
            >
              <img src="/img/null_flow.svg" alt="" />
              <span>منعدم</span>
            </FlowButton>
            <FlowButton
              id="lowFlow"
              onClick={() => {
                alert("clicked");
                setConfirmationBox(true);
                setTankStatus(TankStatus.HALFFUll);
              }}
            >
              <img src="/img/low_flow.svg" alt="" />
              <span>ضئيل</span>
            </FlowButton>
            <FlowButton
              id="highFlow"
              onClick={() => {
                alert("clicked");
                setConfirmationBox(true);
                setTankStatus(TankStatus.FULL);
              }}
            >
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
  /* max-height: 140px; */
  border-radius: 14px 14px 0 0;
`;

const PostBox = styled.div`
  width: 100%;
  text-align: center;
  padding: 20px;
  color: ${GLOBAL_STYLE.colorBlueDarken};
  background: ${GLOBAL_STYLE.colorBlueSweet};
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 16px 0px;

  span {
    font-weight: 600;
  }
  :hover {
    cursor: pointer;
  }
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
  background-color: ${GLOBAL_STYLE.colorBlueSweet};
  height: 20%;
  width: 100%;
  padding: 20px;

  p,
  span {
    text-align: center;
    /* color: ${GLOBAL_STYLE} */
  }
`;

export default BottomNav;
