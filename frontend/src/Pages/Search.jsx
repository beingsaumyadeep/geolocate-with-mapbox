import React, { useState, useRef, useCallback } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

const CardComponent = ({ name, coordinates }) => (
  <React.Fragment>
    <CardContent sx={{ pb: 0 }}>
      <Typography variant="h5" component="div">
        {name}
      </Typography>
      <Typography variant="p" component="div">
        {"["} {coordinates[0]}, {coordinates[1]} {"]"}
      </Typography>
    </CardContent>
  </React.Fragment>
);

export default function Search() {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 4,
  });

  React.useEffect(() => {
    call();
  }, []);

  const [lists, setLists] = useState([]);
  const call = async (longitude, latitude) => {
    try {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}find/${
          !longitude ? "" : `?longitude=${longitude}&latitude=${latitude}`
        }`
      );
      setLists(
        data.data.map((dt) => {
          const { name, location, _id } = dt;
          return {
            name,
            coordinates: location.coordinates,
            id: _id,
          };
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const mapRef = useRef();
  const handleViewportChange = useCallback((newViewport) => {
    // console.log(newViewport);
    setViewport(newViewport);
  }, []);

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      call(newViewport.longitude, newViewport.latitude);
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );
  return (
    <>
      <Helmet>
        <title>Search - GeoLocale</title>
      </Helmet>
      <div className="wrap-off" />
      <div style={{ height: "calc(100vh - 64px)", position: "relative" }}>
        <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <Box
            pt={2}
            px={2}
            sx={{
              maxHeight: "calc(100vh - 64px)",
              overflow: "auto",
              width: "40%",
              background: "#303030",
            }}
          >
            {lists.map((data, index) => (
              <Box my={2} key={index}>
                <Card variant="outlined" sx={{ boxShadow: 1, p: 0 }}>
                  <CardComponent
                    name={data.name}
                    coordinates={data.coordinates}
                  />
                </Card>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              overflow: "auto",
              width: "60%",
              background: "#000",
            }}
          >
            <MapGL
              ref={mapRef}
              {...viewport}
              width="100%"
              height="100%"
              onViewportChange={handleViewportChange}
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
              mapStyle="mapbox://styles/campusless/ckzjuvncy00h715pccez4xrz4"
            >
              <Geocoder
                mapRef={mapRef}
                onViewportChange={handleGeocoderViewportChange}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
                position="top-left"
              />
              {lists.map((dt) => (
                <Marker
                  longitude={dt.coordinates[0]}
                  latitude={dt.coordinates[1]}
                  anchor="bottom"
                >
                  <img
                    src="/Assets/images/drop-pin.png"
                    alt=""
                    style={{ maxHeight: 20 }}
                  />
                </Marker>
              ))}
            </MapGL>
          </Box>
        </Box>
      </div>
    </>
  );
}
