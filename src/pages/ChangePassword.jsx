import React, { useState } from "react";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setError("❌ รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    // TODO: เรียก API เปลี่ยนรหัสผ่าน
    console.log("submit:", form);

    setSuccess("✅ เปลี่ยนรหัสผ่านสำเร็จ");
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          เปลี่ยนรหัสผ่าน
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่านเดิม
            </label>
            <input
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่านใหม่
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error / Success message */}
          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm font-medium">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 transition"
          >
            บันทึกการเปลี่ยนรหัสผ่าน
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
