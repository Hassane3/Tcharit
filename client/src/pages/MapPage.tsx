import React from "react";
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
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Button, ButtonBase } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// MODELS
import TankStatus from "../models/utils/TankStatus";

// Componenets
interface markerDataProps {
  id: number;
  name: string;
  // description: string;
  latLng: [number, number];
  status: TankStatus;
  lastCheck: number;
}
function MapPage() {
  const markers: markerDataProps[] = [
    {
      id: 1,
      latLng: [32.47, 3.688],
      name: "العين",
      // description: "الخزان ممتلئ",
      status: TankStatus.FULL,
      // tank_icon: "./img/filled_tank.svg",
      lastCheck: 7,
    },
    {
      id: 2,
      latLng: [32.4712, 3.6876],
      name: "العيببن",
      status: TankStatus.HALFFUll,
      lastCheck: 300,
      // tank_description: "الخزان نصف ممتلئ",
      // tank_icon: "./img/halffilled_tank.svg",
    },
    {
      id: 3,
      latLng: [32.4718, 3.688],
      name: "زايدي",
      status: TankStatus.EMPTY,
      lastCheck: 5000,
      // tank_description: "الخزان فارغ",
      // tank_icon: "./img/empty_tank.svg",
    },
  ];

  const customIcon = new Icon({
    iconUrl: "./img/epingle.png",
    iconSize: [38, 38],
  });

  const navigateTo = useNavigate();
  return (
    <div id="map">
      <MapContainer center={[32.47, 3.688]} zoom={18} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {markers.map((marker: markerDataProps) => (
            <Marker
              key={marker.name}
              position={marker.latLng}
              icon={customIcon}
              // eventHandlers={{
              //   click: (e) => {
              //     console.log("marker" + marker.tank_name + "clicked", e)
              //   }
              // }}
            >
              <Popup className="popUp_container">
                <PopUpBox
                  onClick={(e) => {
                    console.log("marker " + marker.name + "clicked =>", e);
                    navigateTo("/tank/" + marker.id);
                  }}
                >
                  {/* className="popUp_main"
                  onClick={(e) =>
                    console.log("marker " + marker.tank_name + "clicked =>", e)
                  }> */}

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
                          : TankStatus.HALFFUll
                          ? "الخزان نصف ممتلئ"
                          : "الخزان ممتلئ"}
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
        </MarkerClusterGroup>
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
