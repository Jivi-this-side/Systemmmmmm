import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import Tutorial from "./pages/Tutorial";
import ChallengeSelect from "./pages/ChallengeSelect";
import DesignWorkspace from "./components/DesignWorkspace";
import ReviewPage from "./pages/ReviewPage";
import SolutionPage from "./pages/SolutionPage";
import ThemeToggle from "./components/ThemeToggle";

// Prevent flash of wrong theme on first load
const stored =
  localStorage.getItem("sda-theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
if (stored === "dark") document.documentElement.classList.add("dark");

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: "easeIn" } },
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <LandingPage />
              </PageWrapper>
            }
          />
          <Route
            path="/tutorial"
            element={
              <PageWrapper>
                <Tutorial />
              </PageWrapper>
            }
          />
          <Route
            path="/challenges"
            element={
              <PageWrapper>
                <ChallengeSelect />
              </PageWrapper>
            }
          />
          <Route
            path="/workspace/:challengeId"
            element={
              <PageWrapper>
                <DesignWorkspace />
              </PageWrapper>
            }
          />
          <Route
            path="/review/:challengeId"
            element={
              <PageWrapper>
                <ReviewPage />
              </PageWrapper>
            }
          />
          <Route
            path="/solution/:challengeId"
            element={
              <PageWrapper>
                <SolutionPage />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
      <ThemeToggle />
    </>
  );
}
