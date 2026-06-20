'use client';

import Header from '../../components/Header';

export default function MegaMenuDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mega Menu Demo</h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">How to Use:</h2>
              <ul className="text-blue-800 space-y-1">
                <li>• Click on any category in the navigation bar (Men, Women, Kids, Sports)</li>
                <li>• The mega menu will open showing the selected category</li>
                <li>• Click outside the mega menu to close it</li>
                <li>• Click the X button in the top-right corner of the mega menu to close it</li>
                <li>• Click the same category again to toggle it closed</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-900 mb-2">Features:</h2>
              <ul className="text-green-800 space-y-1">
                <li>• Click-based interaction (no hover required)</li>
                <li>• Visual feedback for active category</li>
                <li>• Smooth animations</li>
                <li>• Click outside to close</li>
                <li>• Close button for easy access</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">Try it out:</h2>
              <p className="text-yellow-800">
                Navigate to the top of the page and try clicking on the category buttons in the navigation bar. 
                The mega menu will open with rich content including categories, subcategories, featured items, 
                and flash deals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 