import React, { useState, useRef, useCallback, useContext } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Modal,
  TextField,
  Menu,
  Button,
} from "@mui/material";
import { PinDrop, Add, Search, More } from "@mui/icons-material";
import axios from "axios";
import { Places } from "../Contexts/MyPlacesContext";
import { User } from "../Contexts/UserContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 40,
  p: 4,
};
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2FtcHVzbGVzcyIsImEiOiJja3kwajNlMXAwMjVvMm5wbjB4Mmtnbmd6In0.QBfZfa9cIotiSkzYCUD8gw";

export default function Header(props) {
  const userID = useContext(User);
  const [items, setItems] = useContext(Places);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => window.open("/search", "_self")}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Search />
        </IconButton>
        <p>Search</p>
      </MenuItem>
      <MenuItem onClick={() => window.open("/myplaces", "_self")}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <PinDrop />
        </IconButton>
        <p>My Location</p>
      </MenuItem>
      <MenuItem onClick={handleOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Add />
        </IconButton>
        <p>Add Location</p>
      </MenuItem>
    </Menu>
  );
  const [viewport, setViewport] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 2,
  });

  const [locate, setLocate] = useState([78.9629, 20.5937]);
  const [name, setName] = useState("");

  const onSubmit = async () => {
    if (name.length === 0) {
      return alert("Please enter the place name");
    }
    try {
      setItems([
        ...items,
        {
          name,
          coordinates: locate,
        },
      ]);
      await axios.post(process.env.REACT_APP_API_URL, {
        name,
        userID,
        coordinates: locate,
      });
      setName("");
    } catch (err) {
      console.log(err);
    }
  };
  const mapHeadRef = useRef();
  const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
  }, []);

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      setLocate([newViewport.longitude, newViewport.latitude]);
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ color: "#fff", width: "90%", maxWidth: 540 }}>
          <TextField
            label="My Favorite Location Name"
            color="secondary"
            focused
            fullWidth
            size="small"
            style={{ marginBottom: 20 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <MapGL
            ref={mapHeadRef}
            {...viewport}
            width="100%"
            height="350px"
            onViewportChange={handleViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/campusless/ckzjuvncy00h715pccez4xrz4"
          >
            <Geocoder
              mapRef={mapHeadRef}
              onViewportChange={handleGeocoderViewportChange}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              position="top-left"
            />
          </MapGL>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              label="Longitude"
              color="secondary"
              focused
              style={{ marginTop: 15, marginRight: 30, width: "50%" }}
              size="small"
              value={locate[0]}
              disabled
            />
            <TextField
              label="Latitude"
              color="secondary"
              focused
              style={{ marginTop: 15, width: "50%" }}
              size="small"
              disabled
              value={locate[1]}
            />
          </Box>

          <Button
            color="secondary"
            style={{ marginTop: 20 }}
            variant="contained"
            onClick={onSubmit}
          >
            Add
          </Button>
          <Button
            color="primary"
            style={{ marginTop: 20, marginLeft: 20 }}
            variant="outline"
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" color="primary">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              GeoLocale
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                aria-label="Search"
                color="inherit"
                onClick={() => window.open("/search", "_self")}
              >
                <Search />
                &nbsp;&nbsp; Search
              </Button>
              <Button
                aria-label="My Locations"
                color="inherit"
                onClick={() => window.open("/myplaces", "_self")}
              >
                <PinDrop />
                &nbsp;&nbsp; My Locations
              </Button>
              <IconButton
                size="large"
                aria-label="account of current user"
                color="inherit"
                onClick={handleOpen}
              >
                <Add />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <More />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </Box>
    </>
  );
}
