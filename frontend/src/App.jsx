import React from "react";
import "./style.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import MyPlacesContext from "./Contexts/MyPlacesContext";
import Header from "./Components/Header";

import Home from "./Pages/Home";
import MyPlaces from "./Pages/MyPlaces";
import Search from "./Pages/Search";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "mapbox-gl/dist/mapbox-gl.css";
import UserContext from "./Contexts/UserContext";

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#000",
      contrastText: "#fffcfc",
    },
    secondary: {
      main: "#00b15b",
    },
  },
});

function App() {
  return (
    <UserContext>
      <MyPlacesContext>
        <Router>
          <ThemeProvider theme={theme}>
            <Header />

            <HelmetProvider>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/myplaces" element={<MyPlaces />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </HelmetProvider>
          </ThemeProvider>
        </Router>
      </MyPlacesContext>
    </UserContext>
  );
}

export default App;
