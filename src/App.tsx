import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MentorsPage from './pages/MentorsPage';
import MentorProfilePage from './pages/MentorProfilePage';
import SessionsPage from './pages/SessionsPage';
import FeedbackPage from './pages/FeedbackPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { Mentor } from './types';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'mentors' | 'sessions' | 'feedback'>('home');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [feedbackSession, setFeedbackSession] = useState<{ sessionId: string; mentorId: string } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const handleNavigate = (page: 'home' | 'mentors' | 'sessions' | 'feedback') => {
    setCurrentPage(page);
    setSelectedMentor(null);
    setFeedbackSession(null);
  };

  const handleSelectMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleBackToMentors = () => {
    setSelectedMentor(null);
  };

  const handleLeaveFeedback = (sessionId: string, mentorId: string) => {
    setFeedbackSession({ sessionId, mentorId });
    setCurrentPage('feedback');
  };

  const handleFeedbackComplete = () => {
    setFeedbackSession(null);
    setCurrentPage('sessions');
  };

  const renderPage = () => {
    if (feedbackSession) {
      return (
        <FeedbackPage
          sessionId={feedbackSession.sessionId}
          mentorId={feedbackSession.mentorId}
          onComplete={handleFeedbackComplete}
        />
      );
    }

    if (selectedMentor) {
      return <MentorProfilePage mentor={selectedMentor} onBack={handleBackToMentors} />;
    }

    switch (currentPage) {
      case 'home':
        return <Dashboard />;
      case 'mentors':
        return <MentorsPage onSelectMentor={handleSelectMentor} />;
      case 'sessions':
        return <SessionsPage onLeaveFeedback={handleLeaveFeedback} />;
      case 'feedback':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Complete a session to leave feedback</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
