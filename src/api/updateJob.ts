// UPDATE JOB
export const updateJob = async (
  jobId: string,
  updatedData: {
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
    const response = await fetch(`http://localhost:5000/api/job/updatejob/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.msg || 'Job update failed');
      } else {
        const errorText = await response.text();
        throw new Error(`Unexpected response: ${errorText}`);
      }
    }

    return await response.json(); // updated job data
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
};