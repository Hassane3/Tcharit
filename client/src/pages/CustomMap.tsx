import React, { useState } from "react";
import { AdvancedMarker, Map, Marker } from "@vis.gl/react-google-maps";

const CustomMap = () => {
  // shows marker on London by default
  const [markerLocation, setMarkerLocation] = useState({
    lat: 51.509865,
    lng: -0.118092,
  });

  return (
    <div className="map-container">
      <Map
        style={{ borderRadius: "20px", position: "absolute" }}
        defaultZoom={13}
        defaultCenter={markerLocation}
        gestureHandling={"greedy"}
        disableDefaultUI
        mapId="1717228d98ca3c6c822573b5"
      >
        <AdvancedMarker position={markerLocation} />
      </Map>
    </div>
  );
};

export default CustomMap;
