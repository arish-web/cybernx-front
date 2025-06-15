// const BASE_URL = 'import.meta.env.VITE_API_URL';
// VITE_API_URL="https://cybernx-node.onrender.com/api"

// const BASE_URL = https://cybernx-node.onrender.com/api;

const BASE_URL = import.meta.env.VITE_API_URL;





export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: 'jobseeker' | 'employer',
  company: string,
) => {
  try {
    const response = await fetch(`${BASE_URL}/signUp/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, company}),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.msg || 'Registration failed');
      } else {
        const errorText = await response.text();
        throw new Error(`Unexpected response: ${errorText}`);
      }
    }

    return await response.json(); // { user, token }
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
};
