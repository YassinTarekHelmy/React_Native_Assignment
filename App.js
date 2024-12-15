
import React from "react";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./AuthContext";
import GuestStack from "./GuestStack";
import AppStack from "./AppStack";

const AuthenticatedApp = () => {
  const { user } = useAuth();

  return user ? <AppStack /> : <GuestStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthenticatedApp />
      </NavigationContainer>
    </AuthProvider>
  );
}