import React, { JSX } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { tankDataProps } from "../MapPage";
import { DivIcon } from "leaflet";
import MapTankBox from "./MapTankBox";
import { SvgIconComponent } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactDOMServer from "react-dom/server"; // To render React elements to static markup
import { Container, Typography } from "@mui/material";
import { customTheme, UserData } from "../../App";
import {
  LocationCistern,
  LocationTemporaryCistern,
  TemporaryTank,
} from "../../utils/constants/Icons";
import TankType from "../../models/utils/TankType";

interface MarkerProps {
  marker: tankDataProps;
  userData: UserData;
  favorites: Array<string> | undefined;
  setVisitedTank: (visitedTank: tankDataProps) => void | undefined;
  handleTimeFormat: (arg: number) => [any, string?];
  handleFavorites: (tankId: number) => void;
}

export const MyMarker = (props: MarkerProps): JSX.Element => {
  const {
    marker,
    userData,
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
            textWrap: "nowrap",
          }}
        >
          {tankName}
        </Typography>
        {marker.type === TankType.PERMANENT ? (
          <LocationCistern />
        ) : (
          <LocationTemporaryCistern />
        )}
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
    LocationCistern,
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
            userData={userData}
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
