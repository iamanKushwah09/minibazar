import requests from "./httpService";

const AdminServices = {
  registerAdmin: async (body) => {
    return requests.post("/admin/register", body);
  },

  loginAdmin: async (body) => {
    return requests.post(`/admin/login`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/admin/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/admin/reset-password", body);
  },

  signUpWithProvider: async (body) => {
    return requests.post("/admin/signup", body);
  },

  // Staff-users
  addStaff: async (body) => {
    return requests.post("/admin/add", body, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getAllStaff: async (body) => {
    return requests.get("/admin", body);
  },
  getStaffById: async (id, body) => {
    return requests.post(`/admin/${id}`, body);
  },

  updateStaff: async (id, body) => {
    return requests.put(`/admin/${id}`, body);
  },

  updateStaffStatus: async (id, body) => {
    return requests.put(`/admin/update-status/${id}`, body);
  },

  deleteStaff: async (id) => {
    return requests.delete(`/admin/${id}`);
  },

  // role
  getAllRole: async (body) => {
    return requests.get("/admin", body);
  },

  // OTP services
  sendOtp: async (body) => {
    return requests.post("/admin/send-otp", body);
  },

  verifyOtp: async (body) => {
    return requests.post("/admin/verify-otp", body);
  },

};

export default AdminServices;
