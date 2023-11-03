import React, { useEffect, useState } from "react";
// LIBS
// import { MapContainer } from 'react-leaflet/MapContainer'
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Popup,
  MarkerProps,
} from "react-leaflet";
// import { TileLayer } from 'react-leaflet/TileLayer'
// import { useMap } from 'react-leaflet/hooks'
// import { Marker } from 'react-leaflet';
import { Icon, LatLng } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Button, ButtonBase } from "@mui/material";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

// MODELS
import TankStatus from "../models/utils/TankStatus";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { db } from "../firebase/firebase";
import { UserType } from "../models/utils/UsersType";

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
  lastCheck: number;
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
  date: number;
  time: number;
}

interface mapPageProps {
  tanksData: Array<tankDataProps>;
  visitedTank: tankDataProps | undefined;
  setVisitedTank: (visitedTank: tankDataProps) => void | undefined;
}
function MapPage(props: mapPageProps) {
  const { tanksData, visitedTank, setVisitedTank } = props;

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
    iconSize: [38, 38],
  });

  const navigateTo = useNavigate();

  const tankId: number = parseInt(useParams().id as string);

  // useEffect(() => {
  //   const dbRef = ref(db, "tanks");

  //   return onValue(dbRef, (snapshot: DataSnapshot) => {
  //     snapshot.forEach((tank: any) => {
  //       tanks.push({ id: tank.key, ...tank.val() });
  //       setTanksData(tanks);
  //     });
  //     console.log("TANKS === ", tanksData);
  //   });
  // }, []);
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (success) => {
          console.log("SUCCES");
          let latLng = new LatLng(
            success.coords.latitude,
            success.coords.longitude
          );
          alert("LatLng : " + latLng);
          if (latLng.lat) console.log("LatLng : ", latLng);
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
  console.log("MARKER Data", tanksData);
  // console.log("Tanks data :", tanksData);
  return (
    <div id="map">
      <MapContainer
        center={
          // If user return back to mapPage, the page will be focused on the tank that has been visited
          visitedTank
            ? (console.log("YEP"), visitedTank.latLng)
            : (console.log("NOP"), [43.300787, 5.37724])
        }
        zoom={18}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <MarkerClusterGroup> */}
        {tanksData.map((marker: tankDataProps) => (
          <Marker
            key={marker.id}
            position={marker.latLng}
            icon={customIcon}
            // eventHandlers={{
            //   click: (e) => {
            //     console.log("marker" + marker.tank_name + "clicked", e)
            //   }
            // }}
          >
            {marker.id}
            <Popup className="popUp_container">
              <PopUpBox
                onClick={(e) => {
                  console.log(
                    "marker ==> ",
                    "id :" + marker.id + " , " + marker.name + "clicked =>",
                    e
                  );
                  setVisitedTank(marker);
                  navigateTo("/tank/" + marker.id);
                }}
              >
                <PopUpMainElements>
                  <img
                    className="popUp_icon"
                    src={
                      marker.status === TankStatus.EMPTY
                        ? "./img/empty_tank.svg"
                        : marker.status === TankStatus.HALFFUll
                        ? "./img/halffilled_tank.svg"
                        : "./img/filled_tank.svg"
                    }
                    alt=""
                  />
                  <div className="popUp_text">
                    <p className="popUp_name">{marker.name}</p>
                    <p className="popUp_description">
                      {marker.status === TankStatus.EMPTY
                        ? "الخزان فارغ"
                        : marker.status === TankStatus.HALFFUll
                        ? "الخزان نصف ممتلئ"
                        : marker.status === TankStatus.FULL
                        ? "الخزان ممتلئ"
                        : "لم يسجل اي حالة لهذا الخزان"}
                    </p>
                  </div>
                </PopUpMainElements>
                <span className="popUp_lastCheck">
                  منذ {marker.lastCheck} دقيقة
                </span>
              </PopUpBox>
            </Popup>
          </Marker>
        ))}
        {/* </MarkerClusterGroup> */}
      </MapContainer>
    </div>
  );
}

const PopUpBox = styled(Button)`
  display: flex;
  flex-direction: column;
  width: 100%;

  .popUp_icon {
    height: 70px;
    /* width: 70px; */
  }

  .popUp_text {
    margin-right: 10px;
    width: 100%;
  }

  .popUp_text p {
    margin: 2px;
    text-align: right;
  }
  .popUp_name {
    font-family: "lalezar";
    color: teal;
    font-size: 34px;
  }
  .popUp_description {
    font-family: "changa";
    font-weight: 600;
    font-size: 18px;
  }
  .popUp_lastCheck {
    font-family: rubik;
    font-size: 16px;
    font-weight: 400;
    align-self: start;
  }

  .leaflet-popup-content {
    margin: 0;
  }
`;

const PopUpMainElements = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 10px;
`;
export default MapPage;
