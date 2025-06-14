const BASE_URL = 'http://localhost:5000/api';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        console.log("ass",    errorData.msg)
        throw new Error(errorData.msg);
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
