const BASE_URL = 'http://localhost:5000/api';

export const getApplicationsByUser = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/applyjob/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json(); // Expected to return an array of applications with populated job data
};

export const getCompanyApplications = async (company: string) => {
  const res = await fetch(`${BASE_URL}/applyjob/company-applications?company=${company}`);
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json();
};