// const BASE_URL = 'http://localhost:5000/api';
const BASE_URL = import.meta.env.VITE_API_URL;


export const addJob = async (
  job: {
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    salary: string;
    postedDate: string;
    description: string;
    requirements: string[];
  }
) => {
  try {
    const response = await fetch(`${BASE_URL}/job/addjob`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.msg || 'Job creation failed');
      } else {
        const errorText = await response.text();
        throw new Error(`Unexpected response: ${errorText}`);
      }
    }

    return await response.json(); // job data returned from backend
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
};

export const getJobById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/job/addjob/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch job with id ${id}`);
  }

  const data = await res.json();
  return data;
};

export const getAllJobs = async () => {
  const res = await fetch(`${BASE_URL}/job/getjob`);

  if (!res.ok) {
    throw new Error('Failed to fetch all jobs');
  }

  const data = await res.json();
  return data;
};



