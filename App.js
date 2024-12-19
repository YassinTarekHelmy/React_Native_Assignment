
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { AuthContext, AuthProvider } from "./AuthContext";

import { NavigationContainer } from "@react-navigation/native";
import GuestStack from "./GuestStack";
import AppStack from "./AppStack";

import { listenForFirstTimeLogin } from "./Analytics";

const AuthenticatedApp = () => {
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext);

  return loggedInUser ? <AppStack /> : <GuestStack />;
}   

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(["Warning: ..."]);
    LogBox.ignoreAllLogs();
  }, []);

  return (
      <AuthProvider>
        <NavigationContainer>
          <AuthenticatedApp />
        </NavigationContainer>
      </AuthProvider>
  );
}