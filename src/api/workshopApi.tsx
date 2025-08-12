import apiClient from './client';

export const getAllWorkshops = async () => {
  const response = await apiClient.get(`workshop/workshops`);
  return response.data.data;
};

export const createRegistration = async (registrationData: {
  workshopId: string;
  fullName: string;
  age: number;
  institution: string;
  educationLevel: string;
  email: string;
  contactNumber: string;
  specialRequirements?: string;
}) => {
  const response = await apiClient.post(`/workshop`, registrationData);
  return response.data;
};