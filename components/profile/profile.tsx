'use client';

import { useEffect, useState } from 'react';
import { UserData } from '@/types';
import { axiosHomeProtected } from '@/services/axiosHomeService';
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';

// Define the API response type
interface UserApiResponse {
  id: string;
  name: string;
  status: string;
  user: {
    id: string;
    email: string;
    contact: string;
    role: string;
    avatarUrl: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  address: Array<{
    id: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    isDefault?: boolean;
    type?: 'HOME' | 'WORK' | 'OTHER';
  }>;
  orders: Array<{
    id: string;
    totalAmount: string;
    status: string;
    createdAt: string;
    course: Array<{
      id: string;
      name: string;
      image: string;
      price: string;
    }>;
  }>;
}

interface ApiResponse {
  status: number;
  message: string;
  data: UserApiResponse;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosHomeProtected.get<ApiResponse>('/accounts/customer');
        
        if (response.data?.data) {
          const apiData = response.data.data;
          // Map the API response to UserData type
          const userProfile: UserData = {
            name: apiData.name || apiData.user.email,
            email: apiData.user.email,
            phone: apiData.user.contact || '',
            profileImage: apiData.user.avatarUrl || '/avatar/1.png',
            addresses: (apiData.address || []).map(addr => ({
              id: addr.id,
              type: addr.type || 'HOME',
              street: addr.address,
              city: addr.city,
              state: addr.state,
              zipCode: addr.pinCode,
              isDefault: addr.isDefault || false
            }))
          };
          setUserData(userProfile);
        } else {
          setError('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateUserData = (updatedData: Partial<UserData>) => {
    if (userData) {
      setUserData({ ...userData, ...updatedData });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || 'Failed to load profile data'}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <ProfileSidebar 
            userData={userData} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <ProfileContent 
            userData={userData}
            activeTab={activeTab}
            onUserDataUpdate={handleUpdateUserData}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
