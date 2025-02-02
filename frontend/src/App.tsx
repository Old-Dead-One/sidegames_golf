import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNavBar from "./components/TopNavBar";
import BottomNavBar from "./components/bottomnav";
import CenteredGraphic from "./components/centeredgraphic";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Info from "./pages/Info";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Password from "./pages/Password";
import Transactions from "./pages/Transactions";
import Landing from "./pages/Landing";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReviewCart from "./pages/ReviewCart";
import CreateGame from "./pages/CreateGame";
import MyEvents from "./pages/MyEvents";
const App: React.FC = () => {
  const [navbarColor, setNavbarColor] = useState("#66d3fa");
  const [bgColor, setBgColor] = useState("");

  return (
    <UserProvider>
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
        <div className="flex flex-col min-h-screen" style={{ position: "relative", backgroundColor: bgColor }}>
          <TopNavBar logoColor={navbarColor} />
          <CenteredGraphic setNavbarColor={setNavbarColor} setBgColor={setBgColor} />
          <div style={{ position: "relative", zIndex: 1, marginTop: "40px", paddingBottom: "100px" }}>
            <Routes>
              <Route path="/" element={<Landing theme={bgColor} />} />
              <Route path="/Dashboard" element={<Dashboard theme={bgColor} />} />
              <Route path="/Cart" element={<Cart theme={bgColor} />} />
              <Route path="/Info" element={<Info theme={bgColor} />} />
              <Route path="/Calendar" element={<Calendar theme={bgColor} />} />
              <Route path="/Profile" element={<Profile theme={bgColor} />} />
              <Route path="/Messages" element={<Messages theme={bgColor} />} />
              <Route path="/Notifications" element={<Notifications theme={bgColor} />} />
              <Route path="/Login" element={<Login theme={bgColor} />} />
              <Route path="/Account" element={<Account theme={bgColor} />} />
              <Route path="/Password" element={<Password theme={bgColor} />} />
              <Route path="/Transactions" element={<Transactions theme={bgColor} />} />
              <Route path="/ReviewCart" element={<ReviewCart theme={bgColor} />} />
              <Route path="/CreateGame" element={<CreateGame theme={bgColor} />} />
              <Route path="/MyEvents" element={<MyEvents theme={bgColor} />} />
            </Routes>
          </div>
          <BottomNavBar />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
