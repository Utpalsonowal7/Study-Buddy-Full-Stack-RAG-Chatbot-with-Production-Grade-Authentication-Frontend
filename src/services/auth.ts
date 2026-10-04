import api from "../api/api";

// export default async function userlogin(data: login) {
//      const res = await api.post("/auth/login", data);

//      return res.data;
// }

export async function getCurrentUser() {
     const response = await api.get("/auth/me");
     return response.data;
}

export async function logoutUser() {
     await api.post("/auth/logout");
}

// export async function sendRegisterOtp(email: string): Promise<void> {
//      await api.post("/auth/send-otp", { email });
// }

// export async function verifyRegisterOtp(
//      email: string,
//      otp: string,
// ): Promise<void> {
//      await api.post("/auth/verify-otp", { email, otp });
// }

// export async function registerUser(data: {
//      email: string;
//      name: string;
//      password: string;
// }): Promise<void> {
//      await api.post("/auth/register", data);
// }
