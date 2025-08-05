import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNavBar from "./components/TopNavBar";
import BottomNavBar from "./components/bottomnav";
import CenteredGraphic from "./components/centeredgraphic";
import { UserProvider } from "./context/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactModal from './components/ContactModal';
import LegalModal from './components/LegalModal';
import CartDrawer from './components/CartDrawer';
import Cart from './pages/Cart';
import ProfileEvents from './pages/ProfileEvents';

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Info = lazy(() => import("./pages/Info"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Messages = lazy(() => import("./pages/Messages"));
const Login = lazy(() => import("./pages/Login"));
const Account = lazy(() => import("./pages/Account"));
const Password = lazy(() => import("./pages/Password"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Landing = lazy(() => import("./pages/Landing"));
const ReviewCart = lazy(() => import("./pages/ReviewCart"));
const CreateGame = lazy(() => import("./pages/CreateGame"));
const App: React.FC = () => {
  const [navbarColor, setNavbarColor] = useState("#66d3fa");
  const [bgColor, setBgColor] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalSection, setLegalSection] = useState<string | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const openLegalModal = (section: string) => {
    setLegalSection(section);
    setLegalOpen(true);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
        <UserProvider>
          <div className="flex flex-col min-h-screen pb-footer" style={{ position: "relative", backgroundColor: bgColor }}>
            <TopNavBar logoColor={navbarColor} onCartClick={() => setCartDrawerOpen(true)} />
            <CenteredGraphic setNavbarColor={setNavbarColor} setBgColor={setBgColor} />
            <div style={{ position: "relative", zIndex: 1, marginTop: "40px" }}>
              <Suspense fallback={<LoadingSpinner size="large" />}>
                <Routes>
                  <Route path="/" element={<Landing theme={bgColor} />} />
                  <Route path="/dashboard" element={<Dashboard theme={bgColor} />} />
                  <Route path="/info" element={<Info theme={bgColor} openLegalModal={openLegalModal} onContactClick={() => setContactOpen(true)} />} />
                  <Route path="/calendar" element={<Calendar theme={bgColor} />} />
                  <Route path="/profile" element={<Profile theme={bgColor} />} />
                  <Route path="/messages" element={<Messages theme={bgColor} />} />
                  <Route path="/notifications" element={<Notifications theme={bgColor} />} />
                  <Route path="/login" element={<Login theme={bgColor} />} />
                  <Route path="/account" element={<Account theme={bgColor} />} />
                  <Route path="/password" element={<Password theme={bgColor} />} />
                  <Route path="/transactions" element={<Transactions theme={bgColor} />} />
                  <Route path="/profile-events" element={<ProfileEvents theme={bgColor} />} />
                  <Route path="/review-cart" element={<ReviewCart theme={bgColor} onOpenCart={() => setCartDrawerOpen(true)} />} />
                  <Route path="/create-game" element={<CreateGame theme={bgColor} onContactClick={() => setContactOpen(true)} />} />
                </Routes>
              </Suspense>
            </div>
            <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)}>
              <Cart theme={bgColor} onClose={() => setCartDrawerOpen(false)} />
            </CartDrawer>
            <BottomNavBar onContactClick={() => setContactOpen(true)} onLegalClick={() => setLegalOpen(true)} />
            <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
            <LegalModal open={legalOpen} onClose={() => { setLegalOpen(false); setLegalSection(null); }} section={legalSection} />
            <ToastContainer />
          </div>
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
