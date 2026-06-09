import { User } from '@/types';

export const generateMockUsers = (count: number, role?: User['role']): User[] => {
  const roles: User['role'][] = ['admin', 'staff', 'customer'];
  
  return Array.from({ length: count }, (_, i) => {
    const userRole = role || roles[i % roles.length];
    
    return {
      id: `user-${i + 1}`,
      name: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} ${i + 1}`,
      email: `${userRole}${i + 1}@example.com`,
      role: userRole,
      status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)] as User['status'],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
      lastLogin: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      address: `${i + 1} Main St`,
      city: 'San Francisco',
      country: 'USA',
      postalCode: '94105',
      bio: `This is a sample bio for ${userRole} ${i + 1}.`,
    };
  });
};

export const mockUsers: User[] = generateMockUsers(50);
