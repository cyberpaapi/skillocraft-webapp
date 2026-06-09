'use client';
import { UserData } from '@/types';
import PersonalInfo from './sections/PersonalInfo';
import OrdersList from './sections/OrdersList';
import AccountSettings from './sections/AccountSettings';
import Wishlist from './sections/Wishlist';

interface ProfileContentProps {
  userData: UserData;
  activeTab: string;
  onUserDataUpdate: (data: UserData) => void;
}

const ProfileContent = ({ userData, activeTab, onUserDataUpdate }: ProfileContentProps) => {
  const handleUpdateUserData = (updatedData: Partial<UserData>) => {
    onUserDataUpdate({ ...userData, ...updatedData });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PersonalInfo userData={userData} onUpdate={handleUpdateUserData} />;
      case 'orders':
        return <OrdersList />;
      case 'wishlist':
        return <Wishlist />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <PersonalInfo userData={userData} onUpdate={handleUpdateUserData} />;
    }
  };

  return (
    <div className="flex-1">
      <div className="p-0 sm:p-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {activeTab === 'profile' && 'My Profile'}
          {activeTab === 'orders' && 'My Orders'}
          {activeTab === 'settings' && 'Account Settings'}
        </h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileContent;
