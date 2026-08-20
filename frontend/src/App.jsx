import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import DashboardShell from './components/layout/DashboardShell.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import EducationPage from './pages/EducationPage.jsx';
import ExperiencePage from './pages/ExperiencePage.jsx';
import SkillsPage from './pages/SkillsPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import VolunteerPage from './pages/VolunteerPage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import ResumePage from './pages/ResumePage.jsx';
import ATSScorePage from './pages/ATSScorePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardShell />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardHome />} />
      <Route path="education" element={<EducationPage />} />
      <Route path="experience" element={<ExperiencePage />} />
      <Route path="skills" element={<SkillsPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="volunteer" element={<VolunteerPage />} />
      <Route path="portfolio" element={<PortfolioPage />} />
      <Route path="resume" element={<ResumePage />} />
      <Route path="ats" element={<ATSScorePage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>

    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
);

export default App;
