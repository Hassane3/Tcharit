import { Box, Button, Modal, SwipeableDrawer, Typography } from "@mui/material";
import { LatLng } from "leaflet";
import React, { JSX, MouseEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import { latLngProps, tankDataProps } from "../MapPage";
import TankStatus from "../../models/utils/TankStatus";
import { GLOBAL_STYLE } from "../../utils/constants/constants";
import { customTheme, UserData } from "../../App";
import { Close } from "@mui/icons-material";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import { HighFlow, LowFlow, NullFlow } from "../../utils/constants/Icons";
import { auth } from "../../firebase/firebase";

interface BottomNavProps {
  tankLatLng: latLngProps;
  selectedTankData: tankDataProps;
  setConfirmationBox: (
    arg: boolean,
    tankStatus: TankStatus
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  setTankStatus: (tankStatus: TankStatus) => void;
  openBottomNav: boolean;
  setOpenBottomNav: (state: boolean) => void;
  cookies: any;
  isAddPostAllowed: boolean;
  setIsAddPostAllowed: (arg: boolean) => void;
  userData: UserData;
  // user: {} | null;
}

const BottomNav = (props: BottomNavProps): JSX.Element => {
  const {
    selectedTankData,
    setConfirmationBox,
    setTankStatus,
    tankLatLng,
    openBottomNav,
    setOpenBottomNav,
    cookies,
    isAddPostAllowed,
    setIsAddPostAllowed,
    // user,
    userData,
  } = props;

  const [isAddPostInfosVisible, setIsAddPostInfosVisible] =
    useState<boolean>(false);
  const [isAddPostBtnsVisible, setIsAddPostBtnsVisible] =
    useState<boolean>(false);
  // const [isPosInfosVisible, setIsPosInfosVisible] = useState<boolean>(true);
  const [isUserNextCistern, setIsUserNextCistern] = useState<boolean>(false);
  const [isPostBtnsVisible, setIsPostBtnsVisible] = useState<boolean>(false);
  const [isUserFarFromTank, setIsUserFarFromTank] = useState<boolean>(false);
  const [isLocModalVisible, setIsLocModalVisible] = useState<boolean>(false);

  // const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer =
    (newOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setOpenBottomNav(newOpen);
    };
  const drawerBleeding = 56;

  // useEffect(() => {
  //   console.log("isAddPostAllowed > ", isAddPostAllowed);
  //   // console.log("UE > ", open);
  //   // if (!isAddPostAllowed) {
  //   //   setTimeout(() => {
  //   //     setOpen(false);
  //   //   }, 3000);
  //   // }
  // }, []);

  const handleCheckTank = () => {
    // If user is a random person we check his position else if its cistern agent, we do not:
    let user = auth.currentUser;
    if (user) {
      setIsAddPostAllowed(true);
    } else if (navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(
        (success) => {
          let latLng = new LatLng(
            success.coords.latitude,
            success.coords.longitude
          );
          console.log("handleCheck");
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
          console.log("getCurrentPos");
          if (
            //
            // latLng.lat > tankLatLng.lat - 0.001 &&
            // latLng.lat < tankLatLng.lat + 0.001 &&
            // latLng.lng > tankLatLng.lng - 0.001 &&
            // latLng.lng < tankLatLng.lng + 0.001
            1 == 1
          ) {
            // If user cookie exist, that means he has posted recently
            if (cookies.userId) {
              alert(
                "Vous ne pouvez ajouter un post car venez de le faire. Pour pouvoir ajouter un post de nouveau, il faut attendre unpeu et puis rafraichir la page"
              );
            } else {
              setIsAddPostAllowed(true);
            }
          } else {
            setIsLocModalVisible(true);
            // alert("U are far from tank ! `\t` Try to come closer");
          }
        },
        (error) => {
          console.log("ERROR => ", error);
          alert("Unable to get your location, please activate to geolocation");
          // TREAT ERROR TYPES
        }
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={openBottomNav}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      swipeAreaWidth={drawerBleeding}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -drawerBleeding,
          visibility: "visible",
          right: 0,
          left: 0,
          backgroundColor: customTheme.palette.background.defaultBlue,
          boxShadow: "0px -10px 10px -10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px 10px 0px 0px",

          display: "flex column",
          justifyContent: "center",
          alignItems: "center",
          height: drawerBleeding,
        }}
      >
        {/* <Puller backgroundColor={customTheme.palette.background.yellowDark}/> */}
        {/* Puller */}
        <div
          style={{
            width: 30,
            height: 6,
            backgroundColor: customTheme.palette.background.defaultWhite,
            borderRadius: 3,
            position: "absolute",
            top: 8,
            left: "calc(50% - 15px)",
          }}
        />
        <Typography
          variant="h3"
          sx={{
            p: 2,
            fontSize: "1.2em",
            fontWeight: "500",
            lineHeight: "unset",
            color: customTheme.palette.background.defaultWhite,
            textAlign: "center",
          }}
        >
          Report water flow
          {/* Signaler le débit d'eau */}
          {/* تنبيه عن حالة تدفق المياه */}
        </Typography>
      </div>
      {/* <Box style={{ px: 2, pb: 2, height: "100%", overflow: "auto" }}> */}
      <Box
        style={{
          height: "100%",
          overflow: "auto",
          backgroundColor: customTheme.palette.background.defaultBlue,
          // padding: "20px 0",
        }}
      >
        {/* <Skeleton variant="rectangular" height="100%" /> */}
        {!isAddPostAllowed && (
          <PostBoxInfos>
            <PersonPinCircleIcon
              sx={{
                color: customTheme.palette.background.defaultWhite,
                fontSize: "50px",
              }}
            />
            <Typography
              variant="h3"
              // fontSize={"1.4rem"}
              // fontWeight={"500"}
              sx={{ padding: "20px 0" }}
              color={customTheme.palette.background.blue}
            >
              To be sure that cistern reports are truthful, you must be beside
              of the concerned cistern
            </Typography>
            <Button
              variant="contained"
              onClick={handleCheckTank}
              size="large"
              sx={{
                background: customTheme.palette.background.blueDark,
                color: customTheme.palette.background.defaultWhite,
              }}
            >
              <span>Continu</span>
            </Button>
          </PostBoxInfos>
        )}
        {isAddPostAllowed && (
          <FlowButtons>
            <FlowButton
              id="empty"
              backgroundColor={customTheme.palette.background.red}
              textColor={customTheme.palette.background.defaultBlue}
              onClick={setConfirmationBox(true, TankStatus.EMPTY)}
            >
              <NullFlow />
              <Typography variant="button" sx={{ fontSize: "1.2em" }}>
                منعدم
              </Typography>
            </FlowButton>
            <FlowButton
              backgroundColor={customTheme.palette.background.yellow}
              textColor={customTheme.palette.background.defaultBlue}
              onClick={setConfirmationBox(true, TankStatus.HALFFUll)}
            >
              <LowFlow />
              {/* <img src="/img/low_flow.svg" alt="" /> */}
              <Typography variant="button" sx={{ fontSize: "1.2em" }}>
                ضئيل
              </Typography>
            </FlowButton>
            <FlowButton
              id="full"
              backgroundColor={customTheme.palette.background.blue}
              textColor={customTheme.palette.background.defaultBlue}
              onClick={setConfirmationBox(true, TankStatus.FULL)}
            >
              <HighFlow />
              {/* <img src="/img/high_flow.svg" alt="" /> */}
              <Typography variant="button" sx={{ fontSize: "1.2em" }}>
                قوي
              </Typography>
            </FlowButton>
          </FlowButtons>
        )}
      </Box>

      <Modal
        open={isLocModalVisible}
        onClose={() => setIsLocModalVisible(false)}
      >
        <Box sx={{ textAlign: "center" }}>
          <Button onClick={() => setIsLocModalVisible(false)}>
            <Close />
          </Button>
          <Typography variant="h3">
            Apparently, your position is far from the cistern, please try to
            come closer
          </Typography>
        </Box>
      </Modal>
    </SwipeableDrawer>
  );
};

const FlowButtons = styled.div`
  display: flex;
  justify-content: space-around;

  > button {
    border-radius: 0;
  }
  #full {
    border-top-right-radius: 10px;
  }
  #empty {
    border-top-left-radius: 10px;
  }
`;
const FlowButton = styled(Button)<{
  backgroundColor: string;
  textColor: string;
}>`
  display: flex;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100%;
  background-color: ${(props) => props.backgroundColor} !important;
  color: ${(props) => props.textColor};

  svg {
    width: 60px;
  }
  span {
    font-weight: 500;
    color: ${(props) => props.textColor};
  }
`;

const PostBoxInfos = styled.div`
  text-align: center;
  padding: 30px 30px;
`;

export default BottomNav;
