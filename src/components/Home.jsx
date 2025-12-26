import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* Main Container - Centered on desktop */}
      <div className="w-full max-w-7xl mx-auto flex">

        {/* Left Sidebar Menu */}
        <div className="w-64 flex-shrink-0 border-r border-gray-300 py-8 px-6">
          <div className="space-y-0">
            {/* Menu Header */}
            <div className="py-4 border-b border-gray-300">
              <h2 className="text-lg font-semibold text-black" style={{ fontFamily: 'Roboto Serif, serif' }}>Menu</h2>
            </div>

            {/* Menu Items */}
            <button className="w-full py-4 text-left border-b border-gray-300 text-black hover:bg-[#B7B7B7] transition-colors">
              <span className="text-base">About Hum</span>
            </button>

            <button className="w-full py-4 text-left border-b border-gray-300 text-black hover:bg-[#B7B7B7] transition-colors">
              <span className="text-base">Support the app</span>
            </button>

            <button className="w-full py-4 text-left border-b border-gray-300 text-black hover:bg-[#B7B7B7] transition-colors">
              <span className="text-base">How you can help</span>
            </button>

            <button className="w-full py-4 text-left border-b border-gray-300 text-black hover:bg-[#B7B7B7] transition-colors">
              <span className="text-base">FAQs</span>
            </button>

            <button className="w-full py-4 text-left border-b border-gray-300 text-black hover:bg-[#B7B7B7] transition-colors">
              <span className="text-base">Terms & Conditions</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 py-12 px-16">
          {/* Logout Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Top Border Line */}
          <div className="border-t border-black mb-16"></div>

          {/* Cards Grid */}
          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* Focus Card */}
            <button className="flex flex-col items-center p-8 border border-gray-300 rounded-2xl hover:bg-gray-50 hover:ring-2 hover:ring-gray-300 transition-all group">
              <div className="w-32 h-32 flex items-center justify-center mb-6">
                <svg className="w-full h-full" viewBox="0 0 80 80" fill="black">
                  <circle cx="40" cy="40" r="12" fill="black"/>
                  <path d="M40 8 C40 8, 25 25, 25 40 C25 55, 40 72, 40 72 C40 72, 55 55, 55 40 C55 25, 40 8, 40 8" fill="none" stroke="black" strokeWidth="3"/>
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-black mb-2" style={{ fontFamily: 'Roboto Serif, serif' }}>Focus</h2>
              <p className="text-lg text-black">Enhance concentration</p>
            </button>

            {/* Calm Card */}
            <button className="flex flex-col items-center p-8 border border-gray-300 rounded-2xl hover:bg-gray-50 hover:ring-2 hover:ring-gray-300 transition-all group">
              <div className="w-32 h-32 flex items-center justify-center mb-6">
                <svg className="w-full h-full" viewBox="0 0 80 80" fill="black">
                  <path d="M20 50 Q20 30, 30 25 Q35 22, 40 30 Q45 22, 50 25 Q60 30, 60 50" fill="black"/>
                  <path d="M25 60 Q25 45, 32 42 Q36 40, 40 46 Q44 40, 48 42 Q55 45, 55 60" fill="black"/>
                  <path d="M30 70 Q30 58, 36 56 Q39 55, 40 59 Q41 55, 44 56 Q50 58, 50 70" fill="black"/>
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-black mb-2" style={{ fontFamily: 'Roboto Serif, serif' }}>Calm</h2>
              <p className="text-lg text-black">Relax and rejuvenate</p>
            </button>

            {/* Breathe Card */}
            <button className="flex flex-col items-center p-8 border border-gray-300 rounded-2xl hover:bg-gray-50 hover:ring-2 hover:ring-gray-300 transition-all group">
              <div className="w-32 h-32 flex items-center justify-center mb-6">
                <svg className="w-full h-full" viewBox="0 0 80 80" fill="black">
                  <circle cx="40" cy="40" r="3" fill="black"/>
                  {/* Radiating lines */}
                  <line x1="40" y1="10" x2="40" y2="25" stroke="black" strokeWidth="2.5"/>
                  <line x1="40" y1="70" x2="40" y2="55" stroke="black" strokeWidth="2.5"/>
                  <line x1="10" y1="40" x2="25" y2="40" stroke="black" strokeWidth="2.5"/>
                  <line x1="70" y1="40" x2="55" y2="40" stroke="black" strokeWidth="2.5"/>
                  <line x1="18" y1="18" x2="28" y2="28" stroke="black" strokeWidth="2.5"/>
                  <line x1="62" y1="62" x2="52" y2="52" stroke="black" strokeWidth="2.5"/>
                  <line x1="62" y1="18" x2="52" y2="28" stroke="black" strokeWidth="2.5"/>
                  <line x1="18" y1="62" x2="28" y2="52" stroke="black" strokeWidth="2.5"/>
                  <line x1="40" y1="15" x2="40" y2="20" stroke="black" strokeWidth="2"/>
                  <line x1="40" y1="65" x2="40" y2="60" stroke="black" strokeWidth="2"/>
                  <line x1="15" y1="40" x2="20" y2="40" stroke="black" strokeWidth="2"/>
                  <line x1="65" y1="40" x2="60" y2="40" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-black mb-2" style={{ fontFamily: 'Roboto Serif, serif' }}>Breathe</h2>
              <p className="text-lg text-black">Build a rhythm</p>
            </button>

          </div>

          {/* Bottom Border Line */}
          <div className="border-b border-black mt-16"></div>
        </div>

      </div>
    </div>
  );
}
