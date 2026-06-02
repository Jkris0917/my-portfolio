import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Certificates from './pages/Certificates';
import Gallery from './pages/Gallery';

// Admin
import AdminLayout from './admin/components/AdminLayout';
import ProtectedRoute from './admin/components/ProtectedRoute';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import ProjectsList from './admin/pages/ProjectsList';
import ProjectForm from './admin/pages/ProjectForm';
import Messages from './admin/pages/Messages';
import AboutForm from './admin/pages/AboutForm';

import ExperienceManager from './admin/pages/ExperienceManager';
import CertificatesManager from './admin/pages/CertificatesManager';
import GalleryManager from './admin/pages/GalleryManager';
import ChangePassword from './admin/pages/ChangePassword';
import SkillsManager from './admin/pages/SkillsManager';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/certificates" element={<PublicLayout><Certificates /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin-panel/login" element={<Login />} />

        <Route path="/admin-panel/dashboard" element={
          <ProtectedRoute>
            <AdminLayout><Dashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/projects" element={
          <ProtectedRoute>
            <AdminLayout><ProjectsList /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/projects/add" element={
          <ProtectedRoute>
            <AdminLayout><ProjectForm /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/projects/:id" element={
          <ProtectedRoute>
            <AdminLayout><ProjectForm /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/messages" element={
          <ProtectedRoute>
            <AdminLayout><Messages /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/about" element={
          <ProtectedRoute>
            <AdminLayout><AboutForm /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/skills" element={
          <ProtectedRoute>
            <AdminLayout><SkillsManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/experience" element={
          <ProtectedRoute>
            <AdminLayout><ExperienceManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/certificates" element={
          <ProtectedRoute>
            <AdminLayout><CertificatesManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/gallery" element={
          <ProtectedRoute>
            <AdminLayout><GalleryManager /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-panel/change-password" element={
          <ProtectedRoute>
            <AdminLayout><ChangePassword /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin-panel" element={<Navigate to="/admin-panel/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;