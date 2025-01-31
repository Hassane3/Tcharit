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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import styled from "styled-components";
import ModalPopUp from "./components/ModalPopUp";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestoreDb } from "../firebase/firebase";
import { logoutUser } from "../firebase/operations";
import { customTheme, UserData } from "../App";
import { Settings } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
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

  type Anchor = "left";
  const [anchorState, setAnchorState] = useState<boolean>(false);
  const anchor = "left";

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
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
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Connect"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              sx={{ flexDirection: "column", alignItems: "start" }}
              onClick={() => navigateTo("/Login")}
            >
              <Box sx={{ display: "flex" }}>
                <ListItemIcon>
                  {text === "Connect" && <AccountBoxIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ margin: 0 }} />
              </Box>
              {text === "Connect" && (
                <p
                  style={{
                    fontSize: "10px",
                    textDecoration: "underline",
                    color: customTheme.palette.text.grey,
                  }}
                >
                  reserved for cistern fillers
                </p>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  const listUserLoggedIn = () => {
    return (
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          <ListItem sx={{ flexDirection: "column", alignItems: "stretch" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText
                primary={userData.name}
                sx={{ margin: 0, textTransform: "capitalize" }}
              />
              <ListItemButton
                sx={{ display: "contents", alignSelf: "flex-end" }}
                // onClick={}
              >
                <Settings />
              </ListItemButton>
            </Box>
            <ListItemText
              secondary={userData.email}
              sx={{
                margin: 0,
                textTransform: "capitalize",
                fontSize: "2rem",
              }}
            />
          </ListItem>
          <Divider />
          <ListItem sx={{ justifyContent: "end" }}>
            <Button variant="contained" onClick={handleLogout}>
              logout
            </Button>
          </ListItem>
        </List>
      </Box>
    );
  };

  const handleLogout = () => {
    try {
      logoutUser();
      // logoutUser
      //   .then((value) => {
      //     console.log(value);
      //     setUserData({
      //       name: null,
      //       email: null,
      //     });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    } catch (error) {
      console.error("Error when login out : ", error);
    }
  };

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleQrModalState =
    (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) =>
      setIsQrModalOpen(state);

  // // When tankAgent is logged
  // const [user, setUser] = useState<{} | null>(null);
  // const [tankAgentData, setTankAgentData] = useState<{} | null>(null);
  // // We track user connection state; and get user datas from firestore
  // const fetchTankAgentData = async () => {
  //   auth.onAuthStateChanged(async (user) => {
  //     setUser(user);
  //     if (user) {
  //       const docRef = doc(firestoreDb, "users", user.uid);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         setTankAgentData(docSnap.data());
  //         console.log("User is not logged in");
  //       } else {
  //         console.log("User is not logged in");
  //       }
  //     }
  //   });
  // };

  // useEffect(() => {
  //   fetchTankAgentData();
  // }, []);
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
          <FirstSection>
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
                onClick={toggleDrawer(anchor, true)}
                // variant=""

                sx={{
                  width: "fit-content",
                  height: "fit-content",
                  margin: "6px",
                  zIndex: "1000",
                  color: customTheme.palette.background.defaultBlue,
                }}
              >
                <MenuRoundedIcon fontSize="large" sx={{ fontSize: "50px" }} />
              </Button>
              <Drawer
                anchor={anchor}
                open={anchorState}
                onClose={toggleDrawer(anchor, false)}
                sx={{
                  backgroundImage: "none",
                }}
                PaperProps={{
                  sx: { backgroundImage: "none" },
                }}
              >
                {user ? listUserLoggedIn() : list(anchor)}
              </Drawer>
            </React.Fragment>
          </FirstSection>
          <Divider
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
          >
            {/* <Chip label="Or" size="small" color={"secondary"} /> */}
          </Divider>
          <Button
            onClick={handleQrModalState(true)}
            variant="text"
            size="large"
            sx={{ width: "fit-content", zIndex: "1000", p: 1 }}
          >
            <QrCodeScannerIcon sx={{ mr: 1, fontSize: 50 }} />
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
            setVisitedTank={setVisitedTank}
            handleTimeFormat={handleTimeFormat}
          />
        ))}

        {/* </MarkerClusterGroup> */}
      </MapContainer>
    </div>
  );
}
const Header = styled.div`
  display: flex;
  flex-direction: column;
`;
const FirstSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default MapPage;
