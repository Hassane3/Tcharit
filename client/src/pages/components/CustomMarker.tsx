import { AdvancedMarker, Marker, useMap } from "@vis.gl/react-google-maps";
import { memo } from "react";
import { GeoLocation } from "../../utils/constants/Icons";

interface MarkerProps {
  position: [number, number];
}

export const CustomMarker = memo(
  ({ position }: MarkerProps) => {
    const map = useMap();
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
      // <Marker
      //   position={{lat:position[0], lng:position[1] }}
      //   icon={icon}
      //   eventHandlers={{
      //     click: (e: any) => {
      //       map.setView([position[0], position[1]], map.getZoom(), {
      //         animate: true,
      //       });
      //     },
      //   }}
      // />
    );
  },
  (prev, next) => {
    return (
      prev.position[0] === next.position[0] &&
      prev.position[1] === next.position[1]
    );
  }
);
