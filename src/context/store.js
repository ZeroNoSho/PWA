"use client";
import { useState, createContext, useEffect } from "react";
const Context = createContext(null);

const Provider = ({ children }) => {
  const [dataApi, DataApiset] = useState({});
  const [loding, Lodingset] = useState({});

  return (
    <Context.Provider
      value={{
        dataApi,
        DataApiset,
        loding,
        Lodingset,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
