import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Slider,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { LatLng } from "leaflet";
import React, { JSX, MouseEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import { latLngProps, tankDataProps } from "../MapPage";
import TankStatus from "../../models/utils/TankStatus";
import { GLOBAL_STYLE } from "../../utils/constants/constants";
import { customTheme, UserData } from "../../App";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import { LoadingButton } from "@mui/lab";
import {
  HighFlow,
  Infos,
  LowFlow,
  NullFlow,
} from "../../utils/constants/Icons";
import { auth } from "../../firebase/firebase";
import SwipeableBox from "./SwipeableBox";
import { checkAndRequestGeolocation } from "../../utils/methods/methods";
import { BoxContainer, ModalContainer } from "./PopUp";
import { Close } from "../../utils/constants/Icons";

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
    // setTankStatus,
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [open, setOpen] = useState<boolean>(false);
  // MSG :
  const [msgFarFromTank, setMsgFarFromTank] = useState<boolean>(false);

  const toggleDrawer =
    (newOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setOpenBottomNav(newOpen);
    };
  const drawerBleeding = 56;
  const [tankStatus, setTankStatus] = useState<number | number[]>(0);
  const valueLabelFormat = (value: number) => {
    return value === 0 ? "empty" : value === 1 ? "half" : "full";
  };
  const statusMarks = [
    {
      value: 0,
      label: "empty",
    },
    {
      value: 1,
      label: "half-full",
    },
    {
      value: 2,
      label: "full",
    },
  ];
  function handleClick() {
    setIsLoading(true);
  }

  //   // If user is a random person we check his position else if its cistern agent, we do not:
  //   let user = auth.currentUser;
  //   if (user) {
  //     setIsAddPostAllowed(true);
  //   } else if (navigator.geolocation.getCurrentPosition) {
  //     navigator.geolocation.getCurrentPosition(
  //       (success) => {
  //         let latLng = new LatLng(
  //           success.coords.latitude,
  //           success.coords.longitude
  //         );
  //         console.log("handleCheck");
  //         // We test if the actual position is near the tank position (the value 0.01 is for test, 0.0001 for high precision) :
  //         // alert(
  //         //   "lat : " +
  //         //     latLng.lat +
  //         //     "lng :" +
  //         //     latLng.lng +
  //         //     "\n" +
  //         //     "tank lat : " +
  //         //     tankLatLng.lat +
  //         //     "tank lng :" +
  //         //     tankLatLng.lng
  //         // );
  //         console.log("getCurrentPos");
  //         if (
  //           //
  //           // latLng.lat > tankLatLng.lat - 0.001 &&
  //           // latLng.lat < tankLatLng.lat + 0.001 &&
  //           // latLng.lng > tankLatLng.lng - 0.001 &&
  //           // latLng.lng < tankLatLng.lng + 0.001
  //           1 == 1
  //         ) {
  //           // If user cookie exist, that means he has posted recently
  //           if (cookies.userId) {
  //             alert(
  //               "Vous ne pouvez ajouter un post car venez de le faire. Pour pouvoir ajouter un post de nouveau, il faut attendre unpeu et puis rafraichir la page"
  //             );
  //           } else {
  //             setIsAddPostAllowed(true);
  //           }
  //         } else {
  //           setIsLocModalVisible(true);
  //           // alert("U are far from tank ! `\t` Try to come closer");
  //         }
  //       },
  //       (error) => {
  //         console.log("ERROR => ", error);
  //         alert("Unable to get your location, please activate to geolocation");
  //         // TREAT ERROR TYPES
  //       }
  //     );
  //   } else {
  //     alert("Geolocation not supported");
  //   }
  // };
  // checkUserPermission
  const handleCheckTank = async () => {
    // If user is a random person we check his position else if its cistern agent, we do not:
    let user = auth.currentUser;
    setIsLoading(true);
    if (user) {
      setIsAddPostAllowed(true);
    } else {
      checkAndRequestGeolocation()
        .then(() =>
          navigator.geolocation.getCurrentPosition((position) => {
            if (position) {
              let latLng = new LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              // We test if the actual position is near the tank position (the value 0.01 is for test, 0.0001 for high precision) :
              if (
                latLng.lat > tankLatLng.lat - 0.0001 &&
                latLng.lat < tankLatLng.lat + 0.0001 &&
                latLng.lng > tankLatLng.lng - 0.0001 &&
                latLng.lng < tankLatLng.lng + 0.0001
              ) {
                // If user cookie exist, that means he has posted recently
                if (cookies.userId) {
                  console.log(
                    "It seems that you have already added a post recently, \n" +
                      "Please wait before you can add another post."
                  );
                } else {
                  setIsAddPostAllowed(true);
                }
              } else {
                setMsgFarFromTank(true);
                console.log(
                  "It seems that you are far from water tank ! \n" +
                    "Try to come closer."
                );
              }
            }
          })
        )
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }
  };

  const handleSetTankStatus = (event: Event, newValue: number | number[]) => {
    console.log("newValue >", newValue);
    setTankStatus(newValue);
  };

  return (
    <div style={{ height: "100%" }}>
      <Box
        style={{
          height: "100%",
          //   overflow: "auto",
          backgroundColor: customTheme.palette.background.defaultWhite,
          //   marginBottom: "20px",
          //   display: "flex",
          // padding: "20px 0",
        }}
      >
        {/* <Skeleton variant="rectangular" height="100%" /> */}
        {!isAddPostAllowed && (
          <NavContent>
            <PersonPinCircleIcon
              sx={{
                color: customTheme.palette.background.defaultBlue,
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
              loading={isLoading}
              // disabled={isLoading}
              variant="contained"
              onClick={handleCheckTank}
              size="large"
              sx={{
                background: customTheme.palette.background.blueDark,
                color: customTheme.palette.background.defaultWhite,
                // "& .MuiCircularProgress-root": {
                "& .MuiCircularProgress-root": {
                  color: customTheme.palette.background.blueDark,
                },
              }}
            >
              <span>Continu</span>
            </Button>
          </NavContent>
        )}
        {isAddPostAllowed && (
          <NavContent>
            <div
              style={{
                height: "100px",
                width: "100px",
                textAlign: "center",
                // marginBottom: "30px 10px 0",
              }}
            >
              <img
                style={{ height: "inherit" }}
                src={
                  tankStatus === 0
                    ? "/img/empty_tap_gif.gif"
                    : tankStatus === 1
                      ? "/img/half_tap_gif.gif"
                      : "/img/full_tap_gif.gif"
                }
                alt="empty taf"
              />
            </div>
            <Slider
              track={false}
              onChange={handleSetTankStatus}
              value={tankStatus}
              // onChange={handleChange}
              defaultValue={3}
              // getAriaValueText={valuetext}
              valueLabelDisplay="off"
              shiftStep={1}
              step={1}
              marks={statusMarks}
              min={0}
              max={2}
              getAriaValueText={valueLabelFormat}
              valueLabelFormat={valueLabelFormat}
              sx={{
                width: "60%",
                margin: "40px 0",
                // ".css-j9vys8-MuiSlider-thumb": {
                ".MuiSlider-thumb": {
                  backgroundColor:
                    tankStatus === 0
                      ? customTheme.palette.background.red
                      : tankStatus === 1
                        ? customTheme.palette.background.yellow
                        : customTheme.palette.background.blue,
                  height: "34px",
                  width: "34px",
                },
                ".MuiSlider-markLabelActive": {
                  color:
                    tankStatus === 0
                      ? customTheme.palette.background.red
                      : tankStatus === 1
                        ? customTheme.palette.background.yellow
                        : customTheme.palette.background.blue,
                  fontSize: "2em",
                  fontWeight: 600,
                  display: "block",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={setConfirmationBox(
                true,
                tankStatus === 0
                  ? TankStatus.EMPTY
                  : tankStatus === 1
                    ? TankStatus.HALFFUll
                    : TankStatus.FULL
              )}
              size="large"
              sx={{
                background: customTheme.palette.background.blueDark,
                color: customTheme.palette.background.defaultWhite,
              }}
            >
              <span>Continu</span>
            </Button>
          </NavContent>
        )}
      </Box>

      <Modal
        open={isLocModalVisible}
        onClose={() => setIsLocModalVisible(false)}
      >
        <Box sx={{ textAlign: "center" }}>
          <Button onClick={() => setIsLocModalVisible(false)}>
            <Close
              backgroundColor={customTheme.palette.background.defaultBlue}
              width={22}
              height={22}
            />
          </Button>
          <Typography variant="h3">
            Apparently, your position is far from the cistern, please try to
            come closer
          </Typography>
        </Box>
      </Modal>

      <ModalContainer
        open={msgFarFromTank}
        onClose={() => setMsgFarFromTank(false)}
      >
        <BoxContainer
          sx={{ backgroundColor: customTheme.palette.background.defaultWhite }}
        >
          <Button
            onClick={() => setMsgFarFromTank(false)}
            sx={{
              minWidth: "unset",
              position: "absolute",
              top: 20,
              right: 20,
              padding: 0,
              color: customTheme.palette.background.defaultBlue,
            }}
          >
            <Close
              backgroundColor={customTheme.palette.background.defaultBlue}
            />
          </Button>
          <div>
            <Infos
              backgroundColor={customTheme.palette.background.defaultBlue}
              width={22}
              height={22}
            />
            <Typography variant="h3">
              Apparently, your position is far from the cistern, please try to
              come closer
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setMsgFarFromTank(false);
              }}
              sx={{
                backgroundColor: customTheme.palette.background.defaultBlue,
                color: customTheme.palette.background.defaultWhite,
              }}
            >
              <span>Ok</span>
            </Button>
          </div>
        </BoxContainer>
      </ModalContainer>
    </div>
  );
};

const NavContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  height: 100%;
`;

export default BottomNav;
