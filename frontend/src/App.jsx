import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Plans from "./pages/Plans.jsx";
import Customize from "./pages/Customize.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Track from "./pages/Track.jsx";
import SocketTest from "./pages/SocketTest.jsx";
import AdminShipments from "./pages/AdminShipments.jsx";


function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/auth"
        element={<Auth />}
      />

      <Route
        path="/plans"
        element={<Plans />}
      />

      <Route
        path="/customize"
        element={<Customize />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/track"
        element={<Track />}
      />

      <Route
        path="/socket-test"
        element={<SocketTest />}
      />

      <Route
        path="/admin"
        element={<AdminShipments />}
      />

    </Routes>

  );

}

export default App;