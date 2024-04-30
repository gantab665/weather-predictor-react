import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Forecast from "./pages/Forecast";
import DayDetail from "./pages/Daydetails"; // Update the import path

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Forecast />} />
        <Route path="/:location/:date" element={<DayDetail />} /> {/* Include both location and date */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;