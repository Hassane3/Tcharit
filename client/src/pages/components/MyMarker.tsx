import React, { JSX } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { tankDataProps } from "../MapPage";
import { DivIcon, Icon } from "leaflet";
import TankStatus from "../../models/utils/TankStatus";
import MapTankBox from "./MapTankBox";
import { SvgIconComponent } from "@mui/icons-material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactDOMServer from "react-dom/server"; // To render React elements to static markup
import { Box, Container, Typography } from "@mui/material";
import { customTheme } from "../../App";

interface MarkerProps {
  marker: tankDataProps;
  setVisitedTank: (visitedTank: tankDataProps) => void | undefined;
  handleTimeFormat: (arg: number) => string;
}

export const MyMarker = (props: MarkerProps): JSX.Element => {
  const { marker, setVisitedTank, handleTimeFormat } = props;
  const map = useMap();

  // To be able to use mui icons in leaflet :
  const createCustomIcon = (
    IconComponent: SvgIconComponent,
    tankName: string
  ) => {
    // Render Material-UI icon as a string (HTML/SVG)
    const iconHTML = ReactDOMServer.renderToStaticMarkup(
      <div
        style={{
          marginTop: "5px",
          textAlign: "center",
          display: "grid",
          justifyContent: "center",
          justifyItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h2"
          style={{
            color: customTheme.palette.background.defaultBlue,
            fontSize: "2em",
            fontFamily: "Changa",
          }}
        >
          {tankName}
        </Typography>
        <LocationOnIcon
          style={{
            fill: customTheme.palette.background.defaultBlue,
            height: "40px",
          }}
        />
      </div>
    );
    // Create a Leaflet divIcon using the rendered HTML
    return new DivIcon({
      html: iconHTML,
      iconSize: [34, 34],
      className: "custom-icon-class",
    });
  };

  const customIconn = createCustomIcon(LocationOnIcon, marker.name);
  return (
    <Container>
      <Marker
        key={marker.id}
        position={marker.latLng}
        // icon={customIconn}
        icon={customIconn}
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
    </Container>
  );
};
