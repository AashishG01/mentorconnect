import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mentor, Session } from '../types';
import { Calendar, Users, Star, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMentors: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    averageRating: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [mentorsResult, sessionsResult] = await Promise.all([
        supabase.from('mentors').select('id', { count: 'exact', head: true }),
        supabase
          .from('sessions')
          .select('*')
          .eq('student_id', user?.id || '')
          .order('scheduled_date', { ascending: true })
          .limit(5),
      ]);

      const upcomingCount = sessionsResult.data?.filter((s) => s.status === 'scheduled').length || 0;
      const completedCount = sessionsResult.data?.filter((s) => s.status === 'completed').length || 0;

      setStats({
        totalMentors: mentorsResult.count || 0,
        upcomingSessions: upcomingCount,
        completedSessions: completedCount,
        averageRating: 0,
      });

      setUpcomingSessions(
        (sessionsResult.data || [])
          .filter((s) => s.status === 'scheduled')
          .map((s) => ({
            ...s,
            mentor_name: '',
            created_at: s.created_at || new Date().toISOString(),
          }))
      );
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your mentoring journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.totalMentors}</p>
          <p className="text-sm text-gray-600">Available Mentors</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.upcomingSessions}</p>
          <p className="text-sm text-gray-600">Upcoming Sessions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.completedSessions}</p>
          <p className="text-sm text-gray-600">Completed Sessions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {stats.averageRating.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Average Rating</p>
        </div>
      </div>

      {upcomingSessions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">{session.topic}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.scheduled_date).toLocaleDateString()} at{' '}
                      {session.scheduled_time}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
