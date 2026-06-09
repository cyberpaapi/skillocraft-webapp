'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FiUser, FiShoppingBag, FiSettings, FiLogOut, FiEdit2 } from 'react-icons/fi';

interface ProfileSidebarProps {
  userData: {
    name: string;
    email: string;
    profileImage: string;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileSidebar = ({ userData, activeTab, onTabChange }: ProfileSidebarProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload logic here
      console.log('Image selected:', file);
    }
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 transition-all duration-200 hover:shadow-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative h-32 w-32 mb-4">
            <div className="h-full w-full rounded-full border-4 border-white bg-gray-100 overflow-hidden">
              <Avatar className="h-full w-full flex items-center justify-center bg-gray-100">
                <AvatarFallback className="text-4xl font-medium text-gray-600">
                  {(userData?.name || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <label className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors flex items-center justify-center w-10 h-10 shadow-md">
              <FiEdit2 className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
          <p className="text-gray-500 text-sm">{userData.email}</p>
          <p className="text-gray-400 text-xs mt-1">Member since 2023</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => onTabChange('profile')}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'profile'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <FiUser className="mr-3 h-5 w-5" />
            Profile
          </button>
          <button
            onClick={() => onTabChange('orders')}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'orders'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <FiShoppingBag className="mr-3 h-5 w-5" />
            My Orders
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'settings'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <FiSettings className="mr-3 h-5 w-5" />
            Account Settings
          </button>
          <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 mt-4 transition-colors">
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ProfileSidebar;
