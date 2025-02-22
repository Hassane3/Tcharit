import React, { useEffect, useState } from "react";
// LIBS
// import { MapContainer } from 'react-leaflet/MapContainer'
import { MapContainer, TileLayer } from "react-leaflet";
// import { TileLayer } from 'react-leaflet/TileLayer'
// import { useMap } from 'react-leaflet/hooks'
// import { Marker } from 'react-leaflet';
import { Icon, LatLng } from "leaflet";
// MODELS
import TankStatus from "../models/utils/TankStatus";
// import { DataSnapshot, onValue, ref } from "firebase/database";
import { UserType } from "../models/utils/UsersType";
import { handleTimeFormat } from "../utils/methods/methods";
import { MyMarker } from "./components/MyMarker";
import AutoComplete from "./components/AutoComplete";
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import styled from "styled-components";
import ModalPopUp from "./components/ModalPopUp";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestoreDb } from "../firebase/firebase";

import { customTheme, UserData } from "../App";
import { Settings } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Menu from "./components/Menu";
// Componenets

export interface tanksDataProps {
  data: tankDataProps[];
}
export interface tankDataProps {
  id: number;
  name: string;
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
  // id: number;
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
  const {
    tanksData,
    visitedTank,
    user,
    userData,
    setVisitedTank,
    setUserData,
  } = props;

  const [searchValue, setSearchValue] = useState<string | null>(
    tanksData.at(0)?.name || ""
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [favorites, setFavorites] = useState<Array<string> | undefined>(
    localStorage.getItem("favorites")?.split(",")
  );
  const customIcon = new Icon({
    iconUrl: "./img/epingle.png",
    iconSize: [38, 38],
  });

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

  const [anchorState, setAnchorState] = useState<boolean>(false);

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
    // alert("handleFavorites");
    // let myStorage = localStorage.getItem("favorites");

    let newArray: Array<string> = [];
    let getFavorites = localStorage.getItem("favorites")?.split(",");
    // alert("favorites >" + favorites);
    // alert("getFavorites >" + getFavorites);
    if (getFavorites && getFavorites.includes(tankId.toString())) {
      // alert("it includes");
      // Remove the tank from favorite (return an array that doesn't contain the tankId value)
      newArray = getFavorites.filter((value) => value !== tankId.toString());

      // alert("newArray >" + newArray);
      if (newArray.length === 0) {
        localStorage.removeItem("favorites");
      } else {
        localStorage.setItem("favorites", newArray.toString());
      }
      setFavorites(newArray);
    } else {
      // alert("it doesn't includes");
      // newArray.(favorites&&favorites + tankId.toString())
      // newArray = [favorites + tankId.toString()];
      // We add it
      // myStorage &&
      if (getFavorites !== undefined && getFavorites.length > 0) {
        newArray = [getFavorites + "," + tankId.toString()];
      } else {
        newArray = [tankId.toString()];
      }
      // alert("new Array >" + newArray);
      localStorage.setItem("favorites", newArray.toString());
      setFavorites(newArray);
    }
  };
  useEffect(() => {}, []);

  return (
    <div id="map">
      <MapContainer
        center={
          // If user return back to mapPage, the page will be focused on the tank that has been visited
          visitedTank ? visitedTank.latLng : [43.300787, 5.37724]
        }
        zoom={18}
        scrollWheelZoom={false}
        style={{ color: "blue" }}
      >
        <Header>
          <TopSection>
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
              <Button
                variant="text"
                onClick={toggleDrawer(anchor, true)}
                sx={{
                  width: "fit-content",
                  height: "fit-content",
                  margin: "6px",
                  zIndex: "1000",
                  padding: "0",
                  color: customTheme.palette.background.defaultBlue,
                }}
              >
                <MenuRoundedIcon fontSize="large" sx={{ fontSize: "50px" }} />
              </Button>
              <Menu
                userData={userData}
                anchorState={anchorState}
                user={user}
                anchor={anchor}
                toggleDrawer={toggleDrawer}
              />
            </React.Fragment>
          </TopSection>
          {/* <Divider
            textAlign="left"
            variant="middle"
            sx={{
              zIndex: "1000",
              "&::before, &::after": {
                borderColor: "primary.dark",
                borderWidth: "1px",
                opacity: 0.6,
                alignSelf: "left",
              },
              "&::after": {
                width: "20%",
              },
            }}
          > */}
          {/* <Chip label="Or" size="small" color={"secondary"} /> */}
          {/* </Divider> */}
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
`;
export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default MapPage;
