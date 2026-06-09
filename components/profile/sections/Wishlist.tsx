import { FiHeart } from 'react-icons/fi';

export default function Wishlist() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-2 text-gray-500 mb-6">
          <FiHeart className="text-xl" />
          <h2 className="text-xl font-semibold">My Wishlist</h2>
        </div>
        
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiHeart className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">You have not added any courses to your wishlist yet.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Browse Courses
          </button>
        </div>
      </div>
    </div>
  );
}
