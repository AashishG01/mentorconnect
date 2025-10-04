import { useState } from 'react';
import { Users, BookOpen, Star, ArrowRight } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

export default function LandingPage() {
  const [activeForm, setActiveForm] = useState<'login' | 'register' | 'reset'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">MentorConnect</h1>
              </div>
              <p className="text-xl text-gray-600">
                Connect with expert mentors and accelerate your learning journey
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Expert Mentors
                  </h3>
                  <p className="text-gray-600">
                    Browse through hundreds of experienced mentors across various fields
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Quality Assured
                  </h3>
                  <p className="text-gray-600">
                    All mentors are verified with ratings and reviews from students
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Easy Booking
                  </h3>
                  <p className="text-gray-600">
                    Schedule sessions with just a few clicks and manage everything in one place
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {activeForm === 'login' && (
              <LoginForm
                onSwitchToRegister={() => setActiveForm('register')}
                onSwitchToReset={() => setActiveForm('reset')}
              />
            )}
            {activeForm === 'register' && (
              <RegisterForm onSwitchToLogin={() => setActiveForm('login')} />
            )}
            {activeForm === 'reset' && (
              <ResetPasswordForm onSwitchToLogin={() => setActiveForm('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
