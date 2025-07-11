import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import React, { useEffect, useRef, useState } from "react";
import type { Marker } from "@googlemaps/markerclusterer";
import { tankDataProps } from "./MapPage";
import { UserData } from "../App";
import { handleTimeFormat } from "../utils/methods/methods";
import { MyMarker } from "./components/MyMarker";

type MarkersProps = {
  tanksData: tankDataProps[];
  userData: UserData;
  favorites: Array<string> | undefined;
  setVisitedTank: (visitedTank: tankDataProps) => void;
  handleFavorites: (tankId: number) => void;
};

const Markers = ({
  tanksData,
  userData,
  favorites,
  setVisitedTank,
  handleFavorites,
}: MarkersProps) => {
  const map = useMap();

  // CLUSTER
  // const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  // const clusterer = useRef<MarkerClusterer | null>(null);

  // CLUSTER
  // useEffect(() => {
  //   if (!map) return;
  //   if (!clusterer.current) {
  //     clusterer.current = new MarkerClusterer({ map });
  //   }
  // }, [map]);

  // CLUSTER
  // useEffect(() => {
  //   clusterer.current?.clearMarkers();
  //   clusterer.current?.addMarkers(Object.values(markers));
  // }, [markers]);

  // const setMarkerRef = (
  //   marker: google.maps.marker.AdvancedMarkerElement | null,
  //   key: number
  // ) => {
  //   if (marker && markers[key]) return;
  //   if (!marker && !markers[key]) return;

  //   setMarkers((prev) => {
  //     if (marker) {
  //       return { ...prev, [key]: marker };
  //     } else {
  //       const newMarkers = { ...prev };
  //       delete newMarkers[key];
  //       return newMarkers;
  //     }
  //   });
  // };

  return (
    <>
      {tanksData.map((cistern) => (
        <MyMarker
          key={cistern.id}
          cistern={cistern}
          userData={userData}
          favorites={favorites}
          setVisitedTank={setVisitedTank}
          handleTimeFormat={handleTimeFormat}
          handleFavorites={handleFavorites}
        />
        // <AdvancedMarker
        //   position={cistern.latLng}
        //   key={cistern.id}
        //   ref={(marker) => setMarkerRef(marker, cistern.id)}
        // >
        //   <span style={{ fontSize: "2rem" }}>🌳</span>
        // </AdvancedMarker>
      ))}
    </>
  );
};

export default Markers;
