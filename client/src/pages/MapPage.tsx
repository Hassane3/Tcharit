import React, { useEffect, useState } from "react";
// LIBS
import { MapContainer, TileLayer } from "react-leaflet";
import { Icon, LatLng } from "leaflet";
// MODELS
import TankStatus from "../models/utils/TankStatus";
// import { DataSnapshot, onValue, ref } from "firebase/database";
import { UserType } from "../models/utils/UsersType";
import { handleTimeFormat } from "../utils/methods/methods";
import { MyMarker } from "./components/MyMarker";
import AutoComplete from "./components/AutoComplete";
import { Button, DrawerProps, IconButton } from "@mui/material";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import styled from "styled-components";
import ModalPopUp from "./components/ModalPopUp";
import { useNavigate, useLocation } from "react-router-dom";

import { customTheme, UserData } from "../App";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Menu from "./components/Menu";
import { MenuIcon } from "../utils/constants/Icons";
import { useTranslation } from "react-i18next";
// Componenets

export interface tanksDataProps {
  data: tankDataProps[];
}
export interface tankDataProps {
  id: number;
  latin_name: string;
  arab_name: string;
  // description: string;
  // latLng: [number, number]
  latLng: latLngProps;
  status: TankStatus;
  lastPostTime: number;
  lastCheckTime: number;
  posts: [postsProps];
}

export interface latLngProps {
  lat: number;
  lng: number;
}
export interface postsProps {
  // date: Date;
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

  const [searchValue, setSearchValue] = useState<string | null>(
    tanksData.at(0)?.latin_name || ""
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [favorites, setFavorites] = useState<Array<string> | undefined>(
    localStorage.getItem("favorites")?.split(",")
  );

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (success) => {
          let latLng = new LatLng(
            success.coords.latitude,
            success.coords.longitude
          );
        },
        (error) => {
          console.log("ERROR => ", error);
          alert("Unable to get your location");
        },
        options
      );
    } else {
      alert("Geolocation not supported");
    }
  };

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
    () => localStorage.getItem("lang") || "en"
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

  //Menu list
  const navigateTo = useNavigate();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleQrModalState =
    (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) =>
      setIsQrModalOpen(state);

  const anchor: DrawerProps["anchor"] = "left";

  const handleFavorites = (tankId: number) => {
    let newArray: Array<string> = [];
    let getFavorites = localStorage.getItem("favorites")?.split(",");
    if (getFavorites && getFavorites.includes(tankId.toString())) {
      // Remove the tank from favorite (return an array that doesn't contain the tankId value)
      newArray = getFavorites.filter((value) => value !== tankId.toString());

      if (newArray.length === 0) {
        localStorage.removeItem("favorites");
      } else {
        localStorage.setItem("favorites", newArray.toString());
      }
      setFavorites(newArray);
    } else {
      // We add it
      if (getFavorites !== undefined && getFavorites.length > 0) {
        newArray = [getFavorites + "," + tankId.toString()];
      } else {
        newArray = [tankId.toString()];
      }
      localStorage.setItem("favorites", newArray.toString());
      setFavorites(newArray);
    }
  };
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <div id="map">
      <MapContainer
        center={
          // If user return back to mapPage, the page will be focused on the tank that has been visited
          visitedTank ? visitedTank.latLng : [43.300787, 5.37724]
        }
        zoom={18}
        scrollWheelZoom={true}
        style={{ color: "blue" }}
      >
        <Header>
          <TopSection onClick={(e) => e.stopPropagation()}>
            <AutoComplete
              tanksData={tanksData}
              searchValue={searchValue}
              inputValue={inputValue}
              handleSetSearchValue={handleSetSearchValue}
              handleSetInputValue={handleSetInputValue}
            />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* MENU BUTTON */}
            <React.Fragment>
              <IconButton
                onClick={toggleDrawer(anchor, true)}
                sx={{
                  width: "fit-content",
                  height: "fit-content",
                  margin: "20px",
                  zIndex: "1000",
                  padding: "0",
                  color: customTheme.palette.background.defaultBlue,
                }}
              >
                <MenuIcon
                  backgroundColor={customTheme.palette.background.defaultBlue}
                />
              </IconButton>
              <Menu
                userData={userData}
                anchorState={anchorState}
                user={user}
                anchor={anchor}
                toggleDrawer={toggleDrawer}
                language={language}
                setLanguage={setLanguage}
              />
            </React.Fragment>
          </TopSection>
          <Button
            onClick={handleQrModalState(true)}
            variant="text"
            size="large"
            sx={{ width: "fit-content", zIndex: "1000", p: 1 }}
          >
            <QrCodeScannerIcon
              sx={{
                mr: 1,
                fontSize: 50,
                color: customTheme.palette.background.defaultBlue,
              }}
            />
          </Button>
          <ModalPopUp
            isQrModalOpen={isQrModalOpen}
            qrModalStateHandler={handleQrModalState}
          />
        </Header>
        {/* <MarkerClusterGroup> */}
        {tanksData.map((marker: tankDataProps) => (
          <MyMarker
            key={marker.id}
            marker={marker}
            favorites={favorites}
            setVisitedTank={setVisitedTank}
            handleTimeFormat={handleTimeFormat}
            handleFavorites={handleFavorites}
          />
        ))}

        {/* </MarkerClusterGroup> */}
      </MapContainer>
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
