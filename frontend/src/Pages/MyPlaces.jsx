import React, {
  useContext,
  // useRef,
  useState,
  useEffect,
} from "react";
import { Helmet } from "react-helmet-async";
import { Places } from "../Contexts/MyPlacesContext";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapContainer from "../Components/MapContainer";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

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

export default function MyPlaces() {
  const [items] = useContext(Places);
  // const mapContainer = useRef(null);
  const [locations, setLocations] = useState([]);

  // const map = useRef(null);
  // const [lng] = useState(78.9629);
  // const [lat] = useState(20.5937);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocations(
      items.map((dt) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [dt.coordinates[0], dt.coordinates[1]],
          },
          properties: {
            storeId: dt.name,
          },
        };
      })
    );
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    //eslint-disable-next-line
  }, [items]);

  // useEffect(() => {
  //   if (map.current) return; // initialize map only once
  //   map.current = new mapboxgl.Map({
  //     container: mapContainer.current,
  //     style: "mapbox://styles/campusless/ckzjuvncy00h715pccez4xrz4",
  //     center: [lng, lat],
  //     zoom: 4,
  //     attributionControl: false,
  //   });
  //   //eslint-disable-next-line
  // }, []);
  // useEffect(() => {
  //   if (!map.current) return;
  //   if (loading) return;
  //   console.log(loading);
  //   map.current.on("load", function () {
  //     map.current.loadImage("/Assets/images/drop-pin.png", (error, image) => {
  //       if (error) throw error;
  //       map.current.addImage("drop_pin", image);
  //       console.log(locations);

  //       map.current.addSource("point", {
  //         type: "geojson",
  //         data: {
  //           type: "FeatureCollection",
  //           features: [...locations],
  //         },
  //       });
  //       map.current.addLayer({
  //         id: "points",
  //         type: "symbol",
  //         source: "point", // reference the data source
  //         layout: {
  //           "icon-image": "drop_pin",
  //           "icon-size": 0.05,
  //           "icon-allow-overlap": true,
  //         },
  //       });
  //     });
  //   });
  //   //eslint-disable-next-line
  // }, [loading]);
  return (
    <>
      <Helmet>
        <title>My Places - GeoLocale</title>
      </Helmet>
      <Box
        sx={{ display: "flex", flexDirection: "row", height: "100%" }}
        pt={8}
      >
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
          {items.map((data, index) => (
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
        {!loading ? (
          <MapContainer
            locations={locations}
            sx={{ flex: 1, background: "#000", padding: 0, width: "100%" }}
          />
        ) : (
          ""
        )}
        {/* <Box
          pt={10}
          px={5}
          sx={{ flex: 1, background: "#000", padding: 0 }}
          ref={mapContainer}
          className="map-container"
        ></Box> */}
      </Box>
    </>
  );
}
