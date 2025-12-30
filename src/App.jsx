import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import FocusExercise from './components/FocusExercise';
import CalmExercise from './components/CalmExercise';
import BreatheExercise from './components/BreatheExercise';
import MeditateExercise from './components/MeditateExercise';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise/focus"
            element={
              <ProtectedRoute>
                <FocusExercise />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise/calm"
            element={
              <ProtectedRoute>
                <CalmExercise />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise/breathe"
            element={
              <ProtectedRoute>
                <BreatheExercise />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise/meditate"
            element={
              <ProtectedRoute>
                <MeditateExercise />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
