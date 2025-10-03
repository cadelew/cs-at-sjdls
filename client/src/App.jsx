import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Checklist from './pages/Checklist';
import CyberPatriotChecklist from './pages/CyberPatriotChecklist';
import ApCspReview from './pages/ApCspReview';
import CyberPatriotHome from './pages/CyberPatriotHome';
import CsHome from './pages/CsHome';
import Resources from './pages/Resources';
import QuizList from './pages/QuizList';
import QuizTaking from './pages/QuizTaking';
import QuizResults from './pages/QuizResults';
import UserDashboard from './pages/UserDashboard';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import GettingStarted from './pages/GettingStarted';
import TopReturn from './components/TopReturn';

export default function App() {
  return (
    <BrowserRouter>
      {/* Header */}
      <Header />
      <Routes>
        {/* Public Routes - No account required */}
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/getting-started' element={<GettingStarted />} />
        <Route path='/resources' element={<Resources />} />
        <Route path='/cyberpatriot-home' element={<CyberPatriotHome />} />
        
        {/* Private Routes - Account required */}
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/checklist' element={<Checklist />} />
          <Route path='/cyberpatriot-checklist' element={<CyberPatriotChecklist />} />
          <Route path='/ap-csp-review' element={<ApCspReview />} />
          <Route path='/cs-home' element={<CsHome />} />
          <Route path='/quiz-list' element={<QuizList />} />
          <Route path='/quiz/:id' element={<QuizTaking />} />
          <Route path='/quiz/:id/results' element={<QuizResults />} />
          <Route path='/user-dashboard' element={<UserDashboard />} />
        </Route>
        
        {/* Catch-all route - redirect any undefined paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <TopReturn />
    </BrowserRouter>
  );
}
