import { Marker, useMap } from "react-leaflet";
import { memo } from "react";

interface MarkerProps {
  position: [number, number];
  icon: any;
}

export const CustomMarker = memo(
  ({ position, icon }: MarkerProps) => {
    const map = useMap();
    return (
      <Marker
        position={position}
        icon={icon}
        eventHandlers={{
          click: (e: any) => {
            map.setView([position[0], position[1]], map.getZoom(), {
              animate: true,
            });
          },
        }}
      />
    );
  },
  (prev, next) => {
    return (
      prev.position[0] === next.position[0] &&
      prev.position[1] === next.position[1]
    );
  }
);
