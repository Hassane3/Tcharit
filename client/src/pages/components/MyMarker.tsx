import React, { JSX, useEffect, useRef, useState } from "react";
import { Typography, Container } from "@mui/material";
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
  CollisionBehavior,
} from "@vis.gl/react-google-maps";
import type { Marker } from "@googlemaps/markerclusterer";
import {
  LocationCistern,
  LocationTemporaryCistern,
} from "../../utils/constants/Icons";
import MapTankBox from "./MapTankBox";
import { tankDataProps } from "../MapPage";
import { UserData, customTheme } from "../../App";
import TankType from "../../models/utils/TankType";

interface MarkerProps {
  cistern: tankDataProps;
  userData: UserData;
  favorites: Array<string> | undefined;
  setVisitedTank: (visitedTank: tankDataProps) => void | undefined;
  handleTimeFormat: (arg: number) => [any, string?];
  handleFavorites: (tankId: number) => void;
  // CLUSTER
  // setMarkerRef: (
  //   marker: google.maps.marker.AdvancedMarkerElement | null,
  //   cisternId: number
  // ) => void;
}

export const MyMarker = (props: MarkerProps): JSX.Element => {
  const {
    cistern,
    userData,
    favorites,
    setVisitedTank,
    handleTimeFormat,
    handleFavorites,
  } = props;

  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const [myMarkerRef, myMarker] = useAdvancedMarkerRef();
  const map = useMap();
  const lang = localStorage.getItem("language");

  const hasClickedInsideRef = useRef(false);

  useEffect(() => {
    const handleDocumentClick = () => {
      if (!hasClickedInsideRef.current) {
        setIsInfoWindowOpen(false);
      }
      hasClickedInsideRef.current = false;
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleMarkerClick = () => {
    map?.setZoom(19);
    map?.panTo(cistern.latLng);
    setIsInfoWindowOpen(true);
  };

  return (
    <Container>
      <AdvancedMarker
        key={cistern.id}
        position={cistern.latLng}
        title={lang === "ar" ? cistern.arab_name : cistern.latin_name}
        onClick={handleMarkerClick}
        collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
        clickable
        ref={myMarkerRef}
        // CLUSTER
        // ref={(marker: Marker | null) => {
        //   setMarkerRef(marker, cistern.id);
        // }}
      >
        <div
          style={{
            textAlign: "center",
            display: "grid",
            justifyItems: "center",
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
            {lang === "ar" ? cistern.arab_name : cistern.latin_name}
          </Typography>
          {cistern.type === TankType.PERMANENT ? (
            <LocationCistern />
          ) : (
            <LocationTemporaryCistern />
          )}
        </div>

        {isInfoWindowOpen && (
          <div onMouseDown={() => (hasClickedInsideRef.current = true)}>
            <InfoWindow
              anchor={myMarker}
              disableAutoPan
              minWidth={200}
              maxWidth={210}
              className="popUp_container"
              headerDisabled
              shouldFocus
            >
              <MapTankBox
                key={cistern.id}
                tank={cistern}
                userData={userData}
                favorites={favorites}
                setVisitedTank={setVisitedTank}
                handleTimeFormat={handleTimeFormat}
                handleFavorites={handleFavorites}
              />
            </InfoWindow>
          </div>
        )}
      </AdvancedMarker>
    </Container>
  );
};
