import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./routes/RequireAuth";
import PageLoader from "./components/ui/PageLoader";

const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Faq = lazy(() => import("./pages/Faq"));
const Login = lazy(() => import("./pages/Login"));
const RoleHome = lazy(() => import("./pages/RoleHome"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const PhotoUpload = lazy(() => import("./pages/PhotoUpload"));
const Participants = lazy(() => import("./pages/Participants"));
const AIMatching = lazy(() => import("./pages/AIMatching"));
const MatchReview = lazy(() => import("./pages/MatchReview"));
const QrAccess = lazy(() => import("./pages/QrAccess"));
const Analytics = lazy(() => import("./pages/Analytics"));
const TeamRoles = lazy(() => import("./pages/TeamRoles"));
const SystemRoles = lazy(() => import("./pages/SystemRoles"));
const AccessMatrix = lazy(() => import("./pages/AccessMatrix"));
const Settings = lazy(() => import("./pages/Settings"));
const GuestFlow = lazy(() => import("./pages/GuestFlow"));
const MyPhotos = lazy(() => import("./pages/MyPhotos"));
const Messages = lazy(() => import("./pages/Messages"));
const Customers = lazy(() => import("./pages/Customers"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest/:token" element={<GuestFlow />} />

        {/* Protected: RequireAuth checks login + role access, then renders AppLayout */}
        <Route element={<RequireAuth />}>
          <Route path="/home" element={<RoleHome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/upload" element={<PhotoUpload />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/matching" element={<AIMatching />} />
          <Route path="/review" element={<MatchReview />} />
          <Route path="/qr" element={<QrAccess />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/team" element={<TeamRoles />} />
          <Route path="/roles" element={<SystemRoles />} />
          <Route path="/access-matrix" element={<AccessMatrix />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/my-photos" element={<MyPhotos />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/customers" element={<Customers />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;