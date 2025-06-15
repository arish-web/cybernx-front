// const BASE_URL = 'http://localhost:5000/api';
const BASE_URL = import.meta.env.VITE_API_URL;


export const applyJob = async (applicationData: {
  userId: string;
  jobId: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedDate: string;
  coverLetter: string;
  resume: string;
}) => {
  const res = await fetch(`${BASE_URL}/applyjob/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData),
  });

  if (!res.ok) throw new Error('Failed to apply');
  return res.json();
};

