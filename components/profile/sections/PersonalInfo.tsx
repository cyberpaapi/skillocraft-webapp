'use client';

import { FiMail, FiPhone, FiMapPin, FiEdit2 } from 'react-icons/fi';
import { useState } from 'react';
import { UserData, Address } from '@/types';
import { PersonalInfoForm } from '@/components/forms/PersonalInfoForm';
import { AddressForm } from '@/components/forms/AddressForm';
import { axiosHomeProtected } from '@/services/axiosHomeService';

interface PersonalInfoProps {
  userData: UserData;
  onUpdate: (data: Partial<UserData>) => void;
}

const PersonalInfo = ({ userData, onUpdate }: PersonalInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState(userData);

  const handleSavePersonalInfo = async (data: Pick<UserData, 'name' | 'phone'>) => {
    try {
      // Prepare the update payload with only provided fields
      const updatePayload: { name?: string; contact?: string } = {};
      
      if (data.name !== undefined) updatePayload.name = data.name;
      if (data.phone !== undefined) updatePayload.contact = data.phone;

      // Only make the API call if there are fields to update
      if (Object.keys(updatePayload).length > 0) {
        await axiosHomeProtected.put('/accounts/customer', updatePayload);
      }
      
      // Update local state
      onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // You might want to show an error toast here
      throw error; // Re-throw to allow the form to handle the error
    }
  };

  const handleSaveAddress = (addressData: Omit<Address, 'id'> & { id?: string }) => {
    const {...address } = addressData;
    
    if (editingAddress) {
      // Update existing address
      const updatedAddresses = formData.addresses?.map(addr => {
        if (addr.id === editingAddress.id) {
          return {
            ...addr,
            ...address,
            id: editingAddress.id,
            type: typeof address.type === 'string' ? address.type : addr.type,
            street: typeof address.street === 'string' ? address.street : addr.street,
            city: typeof address.city === 'string' ? address.city : addr.city,
            state: typeof address.state === 'string' ? address.state : addr.state,
            zipCode: typeof address.zipCode === 'string' ? address.zipCode : addr.zipCode,
            isDefault: typeof address.isDefault === 'boolean' ? address.isDefault : addr.isDefault
          };
        }
        return addr;
      }) || [];
      
      onUpdate({ ...formData, addresses: updatedAddresses });
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        type: typeof address.type === 'string' ? address.type : 'home',
        street: typeof address.street === 'string' ? address.street : '',
        city: typeof address.city === 'string' ? address.city : '',
        state: typeof address.state === 'string' ? address.state : '',
        zipCode: typeof address.zipCode === 'string' ? address.zipCode : '',
        isDefault: typeof address.isDefault === 'boolean' ? address.isDefault : false
      };
      
      const updatedAddresses = [...(formData.addresses || []), newAddress];
      onUpdate({ ...formData, addresses: updatedAddresses });
    }
    
    setEditingAddress(null);
    setIsEditingAddress(false);
  };

  const removeAddress = (id: string) => {
    const updatedAddresses = (formData.addresses || []).filter(addr => addr.id !== id);
    onUpdate({ ...formData, addresses: updatedAddresses });
  };

  const setDefaultAddress = (id: string) => {
    const updatedAddresses = (formData.addresses || []).map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    onUpdate({ ...formData, addresses: updatedAddresses });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FiEdit2 className="mr-1" /> Edit
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <PersonalInfoForm
            initialData={formData}
            onSubmit={handleSavePersonalInfo}
            onCancel={() => {
              setFormData(userData);
              setIsEditing(false);
            }}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="mt-1 font-medium">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center mt-1">
                  <FiMail className="text-gray-400 mr-2" />
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center mt-1">
                  <FiPhone className="text-gray-400 mr-2" />
                  <p className="font-medium">{userData.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Default Address</p>
                <div className="flex items-start mt-1">
                  <FiMapPin className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="font-medium">
                    {userData.addresses?.find(addr => addr.isDefault)?.street || 'No default address'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Section */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Addresses</h2>
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsEditingAddress(!isEditingAddress);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            {isEditingAddress ? 'Cancel' : '+ Add New Address'}
          </button>
        </div>

        {(isEditingAddress || editingAddress) && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <AddressForm
              initialData={editingAddress || undefined}
              onSubmit={handleSaveAddress}
              onCancel={() => {
                setEditingAddress(null);
                setIsEditingAddress(false);
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          {formData.addresses && formData.addresses.length > 0 ? (
            formData.addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-400 text-xs capitalize">{address.type}</p>
                    {address.isDefault && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setIsEditingAddress(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    {!address.isDefault && (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setDefaultAddress(address.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Set as default
                        </button>
                      </>
                    )}
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => removeAddress(address.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : !isEditingAddress ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No addresses saved yet.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
