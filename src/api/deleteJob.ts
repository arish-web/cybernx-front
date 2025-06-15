// const BASE_URL = 'http://localhost:5000/api';
const BASE_URL = import.meta.env.VITE_API_URL;



export const deleteJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/delete/job/${jobId}/delete`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to delete job');
  return await res.json();
};