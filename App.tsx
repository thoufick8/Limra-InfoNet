

import React from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import PostPage from './pages/PostPage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePosts from './pages/admin/ManagePosts';
import PostEditor from './pages/admin/PostEditor';
import ManageCategories from './pages/admin/ManageCategories';
import ManageComments from './pages/admin/ManageComments';
import AdminLoginPage from './pages/admin/LoginPage';
import UserLoginPage from './pages/UserLoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import YouTubeTool from './pages/admin/YouTubeTool';
import ManageAdvertisements from './pages/admin/ManageAdvertisements';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReactRouterDOM.HashRouter>
          <ReactRouterDOM.Routes>
            <ReactRouterDOM.Route path="/" element={<HomePage />} />
            <ReactRouterDOM.Route path="/blog" element={<BlogPage />} />
            <ReactRouterDOM.Route path="/post/:id" element={<PostPage />} />
            <ReactRouterDOM.Route path="/category/:name" element={<CategoryPage />} />
            <ReactRouterDOM.Route path="/categories" element={<CategoriesPage />} />
            <ReactRouterDOM.Route path="/about" element={<AboutPage />} />
            <ReactRouterDOM.Route path="/contact" element={<ContactPage />} />
            <ReactRouterDOM.Route path="/login" element={<UserLoginPage />} />
            <ReactRouterDOM.Route path="/admin/login" element={<AdminLoginPage />} />
            <ReactRouterDOM.Route path="/signup" element={<SignUpPage />} />
            
            <ReactRouterDOM.Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <ReactRouterDOM.Route index element={<AdminDashboard />} />
              <ReactRouterDOM.Route path="posts" element={<ManagePosts />} />
              <ReactRouterDOM.Route path="posts/new" element={<PostEditor />} />
              <ReactRouterDOM.Route path="posts/edit/:id" element={<PostEditor />} />
              <ReactRouterDOM.Route path="categories" element={<ManageCategories />} />
              <ReactRouterDOM.Route path="comments" element={<ManageComments />} />
              <ReactRouterDOM.Route path="youtube-tool" element={<YouTubeTool />} />
              <ReactRouterDOM.Route path="advertisement" element={<ManageAdvertisements />} />
            </ReactRouterDOM.Route>
          </ReactRouterDOM.Routes>
        </ReactRouterDOM.HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;