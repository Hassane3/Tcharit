import React, { useEffect, useState } from "react";
// LIBS
// MODELS
import TankStatus from "../models/utils/TankStatus";
// import { DataSnapshot, onValue, ref } from "firebase/database";
import { UserType } from "../models/utils/UsersType";
import {
  checkAndRequestGeolocation,
  handleTimeFormat,
} from "../utils/methods/methods";
// import { MyMarker } from "./components/MyMarker";
import AutoComplete from "./components/AutoComplete";
import {
  Button,
  DrawerProps,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import styled from "styled-components";
import ModalPopUp from "./components/ModalPopUp";
import { useNavigate, useLocation } from "react-router-dom";

import { customTheme, UserData } from "../App";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Menu from "./components/Menu";
import { MenuIcon, TemporaryTank } from "../utils/constants/Icons";
import { Translation, useTranslation } from "react-i18next";
import { Close } from "../utils/constants/Icons";
import { randomInt, randomUUID } from "crypto";
import { setANewCistern } from "../firebase/operations";
import Footer from "./Footer";
import TankType from "../models/utils/TankType";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import trees from "../utils/trees";
import Markers from "./Markers";
// Componenets

export interface tanksDataProps {
  data: tankDataProps[];
}
export interface tankDataProps {
  id: number;
  type: TankType;
  latin_name: string;
  arab_name: string;
  // description: string;
  // latLng: [number, number]
  latLng: latLngProps;
  status: TankStatus;
  lastPostTime: number;
  lastCheckTime: number;
  posts: [postsProps];
  tankAgentId?: string | null;
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
          let latLng = new google.maps.LatLng(
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
  const [newCistern, setNewCistern] = useState<boolean>(false);
  const [newCisternlatLng, setNewCisternlatLng] =
    useState<google.maps.LatLng>();

  const [markerLocation, setMarkerLocation] = useState({
    lat: 51.509865,
    lng: -0.118092,
  });

  // CLUSTER MARKER
  // HERE

  return (
    <div id="map">
      <Map
        style={{ borderRadius: "20px", position: "absolute" }}
        defaultZoom={18}
        defaultCenter={
          visitedTank ? visitedTank.latLng : { lat: 43.300787, lng: 5.37724 }
        }
        gestureHandling={"greedy"}
        disableDefaultUI
        mapId="1717228d98ca3c6c822573b5"
        clickableIcons={false}
      ></Map>
      <Header>
        <TopSection onClick={(e) => e.stopPropagation()}>
          <AutoComplete
            tanksData={tanksData}
            searchValue={searchValue}
            inputValue={inputValue}
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
          <QrCode2RoundedIcon
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
      <Markers
        tanksData={tanksData}
        userData={userData}
        favorites={favorites}
        setVisitedTank={setVisitedTank}
        handleFavorites={handleFavorites}
      />

      <Footer id={tanksData.length} userData={userData} />
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
