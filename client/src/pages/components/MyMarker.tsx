import React, { JSX } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { tankDataProps } from "../MapPage";
import { DivIcon } from "leaflet";
import MapTankBox from "./MapTankBox";
import { SvgIconComponent } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactDOMServer from "react-dom/server"; // To render React elements to static markup
import { Container, Typography } from "@mui/material";
import { customTheme } from "../../App";

interface MarkerProps {
  marker: tankDataProps;
  favorites: Array<string> | undefined;
  setVisitedTank: (visitedTank: tankDataProps) => void | undefined;
  handleTimeFormat: (arg: number) => [any, string?];
  handleFavorites: (tankId: number) => void;
}

export const MyMarker = (props: MarkerProps): JSX.Element => {
  const {
    marker,
    favorites,
    setVisitedTank,
    handleTimeFormat,
    handleFavorites,
  } = props;
  const map = useMap();

  const lang = localStorage.getItem("language");
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

  const customIconn = createCustomIcon(
    LocationOnIcon,
    lang === "ar" ? marker.arab_name : marker.latin_name
  );

  return (
    <Container>
      <Marker
        key={marker.id}
        position={marker.latLng}
        icon={customIconn}
        eventHandlers={{
          click: (e) => {
            map.setView(marker.latLng, map.getZoom(), {
              animate: true,
            });
          },
        }}
      >
        <Popup
          className="popUp_container"
          autoPan={false}
          closeButton={false}
          minWidth={200}
          maxHeight={210}
        >
          <MapTankBox
            tank={marker}
            favorites={favorites}
            setVisitedTank={setVisitedTank}
            handleTimeFormat={handleTimeFormat}
            handleFavorites={handleFavorites}
          />
        </Popup>
      </Marker>
    </Container>
  );
};
