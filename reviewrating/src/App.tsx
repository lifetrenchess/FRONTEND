import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ViewFeedbacks from "./ViewFeedbacks";
import "bootstrap/dist/css/bootstrap.min.css";
 
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/view" element={<ViewFeedbacks />} />
    </Routes>
  </Router>
);
 
export default App