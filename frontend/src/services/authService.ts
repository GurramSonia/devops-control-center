// frontend/src/services/authService.ts

export type LoginResponse = {
  token?: string;
  message?: string;
};

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch("http://127.0.0.1:8000/auth/login", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});

  if (!response.ok) {
    let message = "Login failed";

    try {
      const errorData = await response.json();
      message = errorData?.detail || errorData?.message || message;
    } catch {
      try {
        const text = await response.text();
        if (text) message = text;
      } catch {
        // ignore
      }
    }

    throw new Error(message);
  }

  return response.json();
}