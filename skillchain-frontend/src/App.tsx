import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

// Components
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SubmitProject from './pages/SubmitProject';
import ExploreProjects from './pages/ExploreProjects';
import MyProjects from './pages/MyProjects';

const MotionBox = motion(Box);

function App() {
  return (
    <Router>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        minH="100vh"
        fontFamily="'Inter', sans-serif"
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitProject />} />
          <Route path="/explore" element={<ExploreProjects />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MotionBox>
    </Router>
  );
}

export default App;