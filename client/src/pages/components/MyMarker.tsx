import React, { JSX } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { tankDataProps } from "../MapPage";
import { Icon } from "leaflet";
import TankStatus from "../../models/utils/TankStatus";
import MapTankBox from "./MapTankBox";

interface MarkerProps {
  marker: tankDataProps;
  customIcon: Icon;
  setVisitedTank: (visitedTank: tankDataProps) => void | undefined;
  handleTimeFormat: (arg: number) => string;
}
export const MyMarker = (props: MarkerProps): JSX.Element => {
  const { marker, customIcon, setVisitedTank, handleTimeFormat } = props;
  const map = useMap();
  return (
    <Marker
      key={marker.id}
      position={marker.latLng}
      icon={customIcon}
      eventHandlers={{
        click: (e) => {
          console.log("marker clicked", e);
          // setClickedMarker(marker);
          // setViewOnClick(e);

          map.setView(marker.latLng, map.getZoom(), {
            animate: true,
          });
        },
      }}
    >
      <Popup className="popUp_container" autoPan={false}>
        <MapTankBox
          tank={marker}
          setVisitedTank={setVisitedTank}
          handleTimeFormat={handleTimeFormat}
        />
      </Popup>
    </Marker>
  );
};
