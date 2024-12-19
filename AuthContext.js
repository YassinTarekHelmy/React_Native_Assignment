import React, { useState, useEffect } from "react";

export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <AuthContext.Provider value={{ loggedInUser: loggedInUser, setLoggedInUser: setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};
