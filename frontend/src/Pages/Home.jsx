import React from "react";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ padding: "120px" }}>
      This uses Mapbox API for geo locate the points.
      <br />
      Everytime a new user adds thier location a unique ID is generated on the
      frontend. This ID is used to distinguish the user and thier locations.
    </Box>
  );
}
