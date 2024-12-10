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
import QrScanner from "./components/QrScanner";
import zIndex from "@mui/material/styles/zIndex";
import { useNavigate } from "react-router-dom";

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
  status: TankStatus;
  userType: UserType;
  date: string;
  time: string;
  weekDay: string;
  postTime: number;
}

export interface userCookiesProps {
  userId: string;
}
interface mapPageProps {
  tanksData: Array<tankDataProps>;
  visitedTank: tankDataProps | undefined;
  // lastCheckTime: number | undefined;
  setVisitedTank: (visitedTank: tankDataProps) => void | undefined;
  // setLastCheckTime: (arg: number) => void;
}
function MapPage(props: mapPageProps) {
  const { tanksData, visitedTank, setVisitedTank } = props;

  const [searchValue, setSearchValue] = useState<string | null>(
    tanksData.at(0)?.name || ""
  );
  const [inputValue, setInputValue] = useState<string>("");

  // const markers: markerDataProps[] = [
  //   {
  //     id: 1,
  //     // latLng: [32.48, 3.688],
  //     latLng: [32.48, 3.688],
  //     name: "HERE",
  //     // description: "الخزان ممتلئ",
  //     status: TankStatus.FULL,
  //     // tank_icon: "./img/filled_tank.svg",
  //     lastCheck: 7,
  //   },
  //   {
  //     id: 6,
  //     latLng: [43.296482, 5.36978],
  //     name: "Actual loc",
  //     status: TankStatus.HALFFUll,
  //     lastCheck: 300,
  //     // tank_description: "الخزان نصف ممتلئ",
  //     // tank_icon: "./img/halffilled_tank.svg",
  //   },
  //   {
  //     id: 5,
  //     latLng: [43.300787, 5.37724],
  //     name: "A",
  //     status: TankStatus.HALFFUll,
  //     lastCheck: 300,
  //     // tank_description: "الخزان نصف ممتلئ",
  //     // tank_icon: "./img/halffilled_tank.svg",
  //   },
  //   {
  //     id: 2,
  //     latLng: [43.30085, 5.378],
  //     name: "B",
  //     status: TankStatus.HALFFUll,
  //     lastCheck: 300,
  //     // tank_description: "الخزان نصف ممتلئ",
  //     // tank_icon: "./img/halffilled_tank.svg",
  //   },
  //   {
  //     id: 3,
  //     latLng: [43.3015, 5.37699],
  //     name: "C",
  //     status: TankStatus.EMPTY,
  //     lastCheck: 5000,
  //     // tank_description: "الخزان فارغ",
  //     // tank_icon: "./img/empty_tank.svg",
  //   }
  // ];

  const customIcon = new Icon({
    iconUrl: "./img/epingle.png",
    // iconSize: [38, 38],
    iconSize: [38, 38],
  });

  // const navigateTo = useNavigate();

  // const tankId: number = parseInt(useParams().id as string);

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

  const [isStartScan, setIsStartScan] = useState<boolean>(false);

  const navigateTo = useNavigate();
  const qrRedirection = (link: string) => {
    // setVisitedTank(tank);
    console.log("MapPage>qr link " + link);
    //Retrieve the last url character to get the number of the tank
    navigateTo("/tank/" + link.at(-1));
  };

  return (
    <div id="map">
      <MapContainer
        center={
          // If user return back to mapPage, the page will be focused on the tank that has been visited
          visitedTank ? visitedTank.latLng : [43.300787, 5.37724]
        }
        zoom={18}
        scrollWheelZoom={false}
      >
        <div style={{ zIndex: 1000, position: "relative" }}>
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

          <button
            onClick={() => {
              alert("btn clicked");
              setIsStartScan(!isStartScan);
            }}
            style={{
              position: "relative",
              top: 60,
              width: "90px",
              margin: 6,
            }}
          >
            {isStartScan ? "Stop scan" : "start scan"}
          </button>
          {isStartScan &&
            (console.log("isStarScan =>", isStartScan),
            (
              <QrScanner
                setIsStartScan={setIsStartScan}
                handleQrRedirection={qrRedirection}
              />
            ))}
        </div>
        {/* <MarkerClusterGroup> */}
        {tanksData.map((marker: tankDataProps) => (
          <MyMarker
            key={marker.id}
            marker={marker}
            customIcon={customIcon}
            setVisitedTank={setVisitedTank}
            handleTimeFormat={handleTimeFormat}
          />
        ))}
        {/* </MarkerClusterGroup> */}
      </MapContainer>
    </div>
  );
}

export default MapPage;
