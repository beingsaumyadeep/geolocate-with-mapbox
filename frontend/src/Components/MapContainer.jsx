import React, { useRef, useState, useEffect } from "react";

import Box from "@mui/material/Box";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
export default function MapContainer({ locations, sx }) {
  const mapContainer = useRef(null);

  const map = useRef(null);
  const [lng] = useState(78.9629);
  const [lat] = useState(20.5937);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/campusless/ckzjuvncy00h715pccez4xrz4",
      center: [lng, lat],
      zoom: 4,
      attributionControl: false,
    });
    //eslint-disable-next-line
  }, []);



  useEffect(() => {
    if (!map.current) return;
    map.current.on("load", function () {
      map.current.loadImage("/Assets/images/drop-pin.png", (error, image) => {
        if (error) throw error;
        map.current.addImage("drop_pin", image);

        map.current.addSource("point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: locations,
          },
        });
        map.current.addLayer({
          id: "points",
          type: "symbol",
          source: "point", // reference the data source
          layout: {
            "icon-image": "drop_pin",
            "icon-size": 0.05,
            "icon-allow-overlap": true,
          },
        });
      });
    });
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <Box ref={mapContainer} sx={sx} className="map-container"></Box>
    </>
  );
}
