import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from "./pages/Register";
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Participants from './pages/Participants';
import CreateParticipant from "./pages/CreateParticipant";
import EditParticipant from "./pages/EditParticipant"; 
import Dashboard from './pages/Dashboard';



const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-layout">
                  <Navbar />
                  <main className="app-main">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/events/create" element={<CreateEvent />} />
                      <Route path="/events/:id/edit" element={<EditEvent />} />
                      <Route path="/events/:id" element={<EventDetail />} />
                      <Route path="/participants" element={<Participants />} />
                      <Route path="/participants/create" element={<CreateParticipant />} />
                      <Route path="/participants/:id/edit" element={<EditParticipant />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes> 
                  </main>
                </div>
              </ProtectedRoute> 
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
};

export default App;
