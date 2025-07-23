import { Box, Button, Modal, Slider, Typography } from "@mui/material";
import { LatLng } from "leaflet";
import React, { JSX, useState } from "react";
import styled from "styled-components";
import { latLngProps, tankDataProps } from "../MapPage";
import TankStatus from "../../models/utils/TankStatus";
import { customTheme, UserData } from "../../App";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import { Infos } from "../../utils/constants/Icons";
import { auth } from "../../firebase/firebase";
import {
  checkAndRequestGeolocation,
  isUserWithinRadius,
} from "../../utils/methods/methods";
import { BoxContainer, ModalContainer } from "./PopUp";
import { Close } from "../../utils/constants/Icons";
import { useTranslation } from "react-i18next";
import { updateCisternlastTimeFilled } from "../../firebase/operations";

interface BottomNavProps {
  tankLatLng: latLngProps;
  selectedTankData: tankDataProps;
  setConfirmationBox: (
    arg: boolean,
    tankStatus: TankStatus
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  cookies: any;
  isAddPostAllowed: boolean;
  setIsAddPostAllowed: (arg: boolean) => void;
  userData: UserData;
  user: {} | null;
  tankId: number;
  handleAddPost: (status: TankStatus) => void;
}

const BottomNav = (props: BottomNavProps): JSX.Element => {
  const {
    setConfirmationBox,
    tankLatLng,
    cookies,
    isAddPostAllowed,
    setIsAddPostAllowed,
    user,
    tankId,
    handleAddPost,
  } = props;

  const [isLocModalVisible, setIsLocModalVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [msgFarFromTank, setMsgFarFromTank] = useState<boolean>(false);

  const [tankStatus, setTankStatus] = useState<number | number[]>(0);
  const valueLabelFormat = (value: number) => {
    return value === 0 ? "empty" : value === 1 ? "half" : "full";
  };
  const { t } = useTranslation();
  const statusMarks = [
    {
      value: 0,
      label: t("common.tank.water_flow.weak"),
    },
    {
      value: 1,
      label: t("common.tank.water_flow.average"),
    },
    {
      value: 2,
      label: t("common.tank.water_flow.high"),
    },
  ];
  function handleClick() {
    setIsLoading(true);
  }

  const handleCheckTank = async () => {
    // If user is a random person we check his position else if its cistern agent, we do not:
    let user = auth.currentUser;
    console.log("user ==>", user);
    setIsLoading(true);
    if (user) {
      setIsAddPostAllowed(true);
      setIsLoading(false);
    } else {
      await checkAndRequestGeolocation()
        .then(() =>
          navigator.geolocation.getCurrentPosition((position) => {
            if (position) {
              let userLatLng = new LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              // We test if the actual position is near the tank position (the value 0.01 is for test, 0.0001 for high precision) :
              if (
                // userLatLng.lat > tankLatLng.lat - 0.0001 &&
                // userLatLng.lat < tankLatLng.lat + 0.0001 &&
                // userLatLng.lng > tankLatLng.lng - 0.0001 &&
                // userLatLng.lng < tankLatLng.lng + 0.0001
                isUserWithinRadius(
                  userLatLng.lat,
                  userLatLng.lng,
                  tankLatLng.lat,
                  tankLatLng.lng
                )
              ) {
                // If user cookie exist, that means he has posted recently
                if (cookies.userId) {
                  alert(t("common.post.alert_posted_recently"));
                } else {
                  setIsAddPostAllowed(true);
                }
              } else {
                setMsgFarFromTank(true);
              }
            }
          })
        )
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }
  };

  const [isConfirmFillCistVisisble, setIsConfirmFillCistVisisble] =
    useState<boolean>(false);

  const handleSetTankStatus = (event: Event, newValue: number | number[]) => {
    setTankStatus(newValue);
  };

  const handlePreventFilledCistern = async (tankId: number) => {
    let now = new Date().getTime();
    await updateCisternlastTimeFilled(tankId, now)
      .then(() => {
        handleAddPost(TankStatus.FULL);
        setIsConfirmFillCistVisisble(false);
      })
      .catch((error) => {
        alert(t("errors.someting_went_wrong"));
      });
  };
  return (
    <div style={{ height: "100%" }}>
      <Box
        style={{
          height: "100%",
          backgroundColor: customTheme.palette.background.defaultWhite,
        }}
      >
        {/* <Skeleton variant="rectangular" height="100%" /> */}
        {!isAddPostAllowed ? (
          !user ? (
            <NavContent>
              <PersonPinCircleIcon
                sx={{
                  color: customTheme.palette.background.defaultBlue,
                  fontSize: "50px",
                }}
              />
              <Typography
                variant="h3"
                sx={{ padding: "20px 0" }}
                color={customTheme.palette.background.blue}
              >
                {t("common.tank.geolocation_user_position")}
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
                  "& .MuiCircularProgress-root": {
                    color: customTheme.palette.background.blueDark,
                  },
                }}
              >
                <span>{t("navigation.continu")}</span>
              </Button>
            </NavContent>
          ) : (
            <NavContent>
              <Button
                loading={isLoading}
                // disabled={isLoading}
                variant="contained"
                onClick={() => setIsConfirmFillCistVisisble(true)}
                size="large"
                sx={{
                  background: customTheme.palette.background.blue,
                  color: customTheme.palette.background.defaultWhite,
                  "& .MuiCircularProgress-root": {
                    color: customTheme.palette.background.blueDark,
                  },
                }}
              >
                <span>{t("common.tank.report_cistern_fill")}</span>
              </Button>
              <span
                style={{
                  height: "1px",
                  width: "70%",
                  backgroundColor: "#bdbdbd",
                }}
              />
              <Button
                loading={isLoading}
                disabled={isLoading}
                variant="contained"
                onClick={() => {
                  user && setIsAddPostAllowed(true);
                }}
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
                <span>{t("common.tank.report_water_flow")}</span>
              </Button>
            </NavContent>
          )
        ) : (
          <NavContent>
            <div
              style={{
                height: "100px",
                width: "100px",
                textAlign: "center",
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
              <span>{t("navigation.continu")}</span>
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
            {t("common.tank.tank_far_from_tank")}
          </Typography>
        </Box>
      </Modal>

      {/* Message --> far from tank */}
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
              {t("common.tank.tank_far_from_tank")}
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
              <span>{t("navigation.ok")}</span>
            </Button>
          </div>
        </BoxContainer>
      </ModalContainer>

      {/* Message (for auth user) --> confirm filled cistern */}
      <ModalContainer
        open={isConfirmFillCistVisisble}
        onClose={() => setIsConfirmFillCistVisisble(false)}
      >
        <BoxContainer
          sx={{ backgroundColor: customTheme.palette.background.defaultWhite }}
        >
          <Button
            onClick={() => setIsConfirmFillCistVisisble(false)}
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
            <Typography variant="h3">
              {t("common.tank.confirm_cistern_filled")}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                handlePreventFilledCistern(tankId);
              }}
              sx={{
                backgroundColor: customTheme.palette.background.greyLight,
                color: customTheme.palette.background.defaultWhite,
              }}
            >
              <span>{t("navigation.yes")}</span>
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
  justify-content: space-evenly;
  padding: 20px;
  width: 100%;
  height: 100%;
`;

export default BottomNav;
