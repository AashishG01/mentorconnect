import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mentor } from '../types';
import { Search, Star, Clock, Languages, Award } from 'lucide-react';

interface MentorsPageProps {
  onSelectMentor: (mentor: Mentor) => void;
}

export default function MentorsPage({ onSelectMentor }: MentorsPageProps) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  useEffect(() => {
    loadMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [searchQuery, selectedExpertise, mentors]);

  const loadMentors = async () => {
    try {
      const { data: mentorsData, error } = await supabase
        .from('mentors')
        .select(`
          *,
          profiles!inner(full_name, email, avatar_url)
        `)
        .order('average_rating', { ascending: false });

      if (error) throw error;

      const formattedMentors: Mentor[] = (mentorsData || []).map((m: any) => ({
        id: m.id,
        full_name: m.profiles.full_name,
        email: m.profiles.email,
        avatar_url: m.profiles.avatar_url,
        expertise: m.expertise || [],
        bio: m.bio || '',
        experience_years: m.experience_years || 0,
        languages: m.languages || [],
        hourly_rate: m.hourly_rate,
        average_rating: m.average_rating || 0,
        total_sessions: m.total_sessions || 0,
      }));

      setMentors(formattedMentors);
      setFilteredMentors(formattedMentors);
    } catch (error) {
      console.error('Error loading mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMentors = () => {
    let filtered = [...mentors];

    if (searchQuery) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.expertise.some((exp) =>
            exp.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          mentor.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedExpertise !== 'all') {
      filtered = filtered.filter((mentor) =>
        mentor.expertise.includes(selectedExpertise)
      );
    }

    setFilteredMentors(filtered);
  };

  const allExpertise = Array.from(
    new Set(mentors.flatMap((m) => m.expertise))
  ).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Mentor</h1>
        <p className="text-gray-600">
          Browse through our community of experienced mentors
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, expertise, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={selectedExpertise}
            onChange={(e) => setSelectedExpertise(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Expertise</option>
            {allExpertise.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition group"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {mentor.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                    {mentor.full_name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">
                      {mentor.average_rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({mentor.total_sessions} sessions)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span>{mentor.experience_years} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Languages className="w-4 h-4 text-gray-400" />
                  <span>{mentor.languages.join(', ')}</span>
                </div>
                {mentor.hourly_rate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>${mentor.hourly_rate}/hour</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.expertise.slice(0, 3).map((exp) => (
                  <span
                    key={exp}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {exp}
                  </span>
                ))}
                {mentor.expertise.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    +{mentor.expertise.length - 3} more
                  </span>
                )}
              </div>

              <button
                onClick={() => onSelectMentor(mentor)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No mentors found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
