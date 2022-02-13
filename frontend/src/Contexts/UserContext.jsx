import React, { createContext, useEffect, useState } from "react";

export const User = createContext();
export default function UserContext({ children }) {
  const [userID, setUserID] = useState("");
  useEffect(() => {
    const id = localStorage.getItem("userID");
    if (id !== null) {
      return setUserID(id);
    }
    const token = (Math.random() + 1).toString(36).substring(7);
    localStorage.setItem("userID", token);
    setUserID(token);
  }, []);

  return <User.Provider value={userID}>{children}</User.Provider>;
}
