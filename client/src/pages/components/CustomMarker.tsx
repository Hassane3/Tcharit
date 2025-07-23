import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { memo } from "react";
import { GeoLocation } from "../../utils/constants/Icons";

interface MarkerProps {
  position: [number, number];
}

export const CustomMarker = memo(
  ({ position }: MarkerProps) => {
    return (
      <AdvancedMarker position={{ lat: position[0], lng: position[1] }}>
        <div
          style={{
            marginTop: "5px",
            textAlign: "center",
            display: "grid",
            justifyContent: "center",
            justifyItems: "center",
            width: "100%",
          }}
          className="geoLocationContainer"
        >
          <GeoLocation />
        </div>
      </AdvancedMarker>
    );
  },
  (prev, next) => {
    return (
      prev.position[0] === next.position[0] &&
      prev.position[1] === next.position[1]
    );
  }
);
