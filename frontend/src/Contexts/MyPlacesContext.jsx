import axios from "axios";
import React, { createContext, useEffect, useState, useContext } from "react";
import { User } from "./UserContext";
// import JSON_OBJ from "./JSON_OBJ";
export const Places = createContext();
export default function MyPlacesContext({ children }) {
  const userID = useContext(User);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // const d = JSON_OBJ.map((data) => {
    //   return {
    //     name: data.name,
    //     coordinates: [data.long, data.lat],
    //     id: data.id,
    //     uuid: data.uuid,
    //   };
    // });
    // setItems(d);
    if (userID.length > 0) return getData();

    //eslint-disable-next-line
  }, [userID]);

  const getData = async () => {
    try {
      const data = await axios.post(`${process.env.REACT_APP_API_URL}me`, {
        userID,
      });
      setItems(
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

  return (
    <Places.Provider value={[items, setItems]}>{children}</Places.Provider>
  );
}
