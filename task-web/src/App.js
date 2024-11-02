import './App.css';
import TaskPage from './TaskPages/MainTasksPage';
import LoginPage from './LoginPages/LoginPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is authenticated

  return (
    <Router>
      <div>
        <Routes>
          <Route 
            path="/login" 
            element={<LoginPage />} 
          />
          <Route 
            path="/tasks" 
            element={isAuthenticated ? <TaskPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
