import { useNavigate } from 'react-router-dom';

export default function CalmExercise() {
  const navigate = useNavigate();

  const handleStartExercise = () => {
    console.log('Starting Calm exercise');
    // Navigate to exercise session or implement exercise logic
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden flex flex-col py-8" style={{ maxWidth: '430px', minHeight: '932px' }}>

        {/* Header */}
        <div className="px-6 py-3 flex justify-between items-center">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="font-medium text-base">Back</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 pt-8 pb-8 flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 80 80" fill="black">
                <path d="M20 50 Q20 30, 30 25 Q35 22, 40 30 Q45 22, 50 25 Q60 30, 60 50" fill="black"/>
                <path d="M25 60 Q25 45, 32 42 Q36 40, 40 46 Q44 40, 48 42 Q55 45, 55 60" fill="black"/>
                <path d="M30 70 Q30 58, 36 56 Q39 55, 40 59 Q41 55, 44 56 Q50 58, 50 70" fill="black"/>
              </svg>
            </div>
            <h1 className="text-5xl font-semibold text-black" style={{ fontFamily: 'Roboto Serif, serif' }}>
              Calm
            </h1>
          </div>

          <p className="text-xl text-gray-700 mb-6">
            Relax and rejuvenate with soothing sounds and gentle guidance.
          </p>

          <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-black mb-3">What to expect</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Peaceful ambient sounds</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Stress relief techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Deep relaxation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Start Exercise Button - Always Enabled */}
        <div className="px-6 pb-8">
          <button
            onClick={handleStartExercise}
            className="w-full py-4 rounded-full font-semibold text-lg bg-black text-white hover:bg-gray-800 transition-all"
          >
            Start Exercise
          </button>
        </div>
      </div>
    </div>
  );
}
