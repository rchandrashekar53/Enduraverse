import React, { createContext, useContext, useState } from "react";

const TelemetryContext = createContext();

export const TelemetryProvider = ({ children }) => {
  const [telemetryData, setTelemetryData] = useState(null);

  return (
    <TelemetryContext.Provider value={{ telemetryData, setTelemetryData }}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => useContext(TelemetryContext);
