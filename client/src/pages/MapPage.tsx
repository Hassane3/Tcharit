import React, { useEffect, useState } from "react";
// LIBS
// MODELS
import TankStatus from "../models/utils/TankStatus";
import { UserType } from "../models/utils/UsersType";
import AutoComplete from "./components/AutoComplete";
import { Button, DrawerProps, IconButton } from "@mui/material";

import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import styled from "styled-components";
import ModalPopUp from "./components/ModalPopUp";
import { useLocation } from "react-router-dom";

import { customTheme, UserData } from "../App";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import Menu from "./components/Menu";
import { MenuIcon } from "../utils/constants/Icons";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
import TankType from "../models/utils/TankType";
import { Map } from "@vis.gl/react-google-maps";
import Markers from "./Markers";
import UseSnackBar from "./components/UseSnackBar";

export interface tanksDataProps {
  data: tankDataProps[];
}
export interface tankDataProps {
  id: number;
  type: TankType;
  latin_name: string;
  arab_name: string;
  description?: string;
  latLng: latLngProps;
  status: TankStatus;
  lastPostTime: number;
  // lastCheckTime: number;
  posts: [postsProps];
  tankAgentId?: string | null;
  lastTimeFilled: number; // concerns filling cistern by cistern agent : it represents date (if less than 1 hour, we display it)
}

export interface latLngProps {
  lat: number;
  lng: number;
}
export interface postsProps {
  id?: number;
  date: string;
  postTime: number;
  status: TankStatus;
  time: string;
  userType: UserType;
  userName: string | null;
  weekDay: string;
}

export interface userCookiesProps {
  userId: string;
}
interface mapPageProps {
  tanksData: Array<tankDataProps>;
  visitedTank: tankDataProps | undefined;
  user: {} | null;
  userData: UserData;
  setVisitedTank: (visitedTank: tankDataProps) => void | undefined;
  setUserData: (userData: UserData) => void;
}

export const WaterIcon = () => {
  return <WaterDropIcon />;
};

function MapPage(props: mapPageProps) {
  const { tanksData, visitedTank, user, userData, setVisitedTank } = props;

  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [favorites, setFavorites] = useState<Array<number> | undefined>(
    localStorage.getItem("favorites")?.split(",").map(Number)
  );

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (success) => {
  //         let latLng = new google.maps.LatLng(
  //           success.coords.latitude,
  //           success.coords.longitude
  //         );
  //       },
  //       (error) => {
  //         console.log("ERROR => ", error);
  //         alert("Unable to get your location");
  //       },
  //       options
  //     );
  //   } else {
  //     alert("Geolocation not supported");
  //   }
  // };

  const handleSetSearchValue = (newValue: string | null) => {
    setSearchValue(newValue);
  };
  const handleSetInputValue = (newValue: string) => {
    setInputValue(newValue);
  };

  const location = useLocation();
  const menuOpen = location.state?.anchorState ?? false;
  const [anchorState, setAnchorState] = useState<boolean>(menuOpen);

  const [language, setLanguage] = useState<string>(
    () => localStorage.getItem("language") || "en"
  );

  const { t, i18n } = useTranslation();
  const toggleDrawer =
    (anchor: DrawerProps["anchor"], open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setAnchorState(open);
    };

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleQrModalState =
    (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) =>
      setIsQrModalOpen(state);

  const anchor: DrawerProps["anchor"] = "left";

  const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  const handleFavorites = (tankId: number) => {
    let newArray: Array<number> = [];
    // let getFavorites = localStorage.getItem("favorites")?.split(",");
    if (favorites && favorites.includes(tankId)) {
      // Remove the tank from favorite (return an array that doesn't contain the tankId value)
      newArray = favorites.filter((value) => value !== tankId);

      if (newArray.length === 0) {
        localStorage.removeItem("favorites");
      } else {
        localStorage.setItem("favorites", newArray.toString());
      }
      setFavorites(newArray);
      setSnackMessage(t("common.tank.removed_from_favorite"));
      setIsSnackOpen(true);
    } else {
      if (favorites !== undefined && favorites.length > 0) {
        newArray = [...favorites, tankId];
      } else {
        newArray = [tankId];
      }
      localStorage.setItem("favorites", newArray.toString());
      setFavorites(newArray);
      setSnackMessage(t("common.tank.added_to_favorite"));
      setIsSnackOpen(true);
    }
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <div id="map">
      <Map
        style={{ borderRadius: "20px", position: "absolute" }}
        defaultZoom={18}
        defaultCenter={
          visitedTank
            ? visitedTank.latLng
            : {
                lat: 32.470097,

                lng: 3.689434,
              }
        }
        gestureHandling={"greedy"}
        disableDefaultUI
        mapId="1717228d98ca3c6c466620c3"
        clickableIcons={false}
      ></Map>
      <Header>
        <TopSection onClick={(e) => e.stopPropagation()}>
          <AutoComplete
            tanksData={tanksData}
            searchValue={searchValue}
            inputValue={inputValue}
            favorites={favorites}
            handleSetSearchValue={handleSetSearchValue}
            handleSetInputValue={handleSetInputValue}
          />

          {/* MENU BUTTON */}
          <React.Fragment>
            <IconButton
              onClick={toggleDrawer(anchor, true)}
              sx={{
                width: "fit-content",
                height: "fit-content",
                margin: "20px",
                zIndex: "200",
                padding: "0",
                color: customTheme.palette.background.defaultBlue,
              }}
            >
              <MenuIcon
                backgroundColor={customTheme.palette.background.defaultBlue}
              />
            </IconButton>
            <Menu
              anchorState={anchorState}
              user={user}
              anchor={anchor}
              toggleDrawer={toggleDrawer}
              language={language}
              setLanguage={setLanguage}
            />
          </React.Fragment>
        </TopSection>
        {/* QR CODE BUTTON */}
        {/* <Button
          onClick={handleQrModalState(true)}
          variant="text"
          size="large"
          sx={{ width: "fit-content", zIndex: "100", p: 1 }}
        >
          <QrCode2RoundedIcon
            sx={{
              mr: 1,
              fontSize: 50,
              color: customTheme.palette.background.defaultBlue,
            }}
          />
        </Button> */}
        <ModalPopUp
          isQrModalOpen={isQrModalOpen}
          qrModalStateHandler={handleQrModalState}
        />
      </Header>
      <Markers
        tanksData={tanksData}
        user={user}
        userData={userData}
        favorites={favorites}
        setVisitedTank={setVisitedTank}
        handleFavorites={handleFavorites}
      />

      {user && <Footer id={tanksData.length} userData={userData} />}

      <UseSnackBar
        isSnackOpen={isSnackOpen}
        setIsSnackOpen={setIsSnackOpen}
        snackMessage={snackMessage}
      />
    </div>
  );
}

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
`;
export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default MapPage;
