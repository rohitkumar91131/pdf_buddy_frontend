import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";

function ShowHeader() {
  const location = useLocation();
  const pathName = location.pathname;

  const isDynamicSingleSegment = /^\/[^/]+$/.test(pathName) && pathName !== "/dashboard" && pathName !== "/auth"; 

  if (isDynamicSingleSegment) {
    return null;
  }

  return <Header />;
}

export default ShowHeader;
