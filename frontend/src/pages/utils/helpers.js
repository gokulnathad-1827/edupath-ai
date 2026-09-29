// Format date (DD/MM/YYYY)
export const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB");
};

// Format time (HH:MM AM/PM)
export const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Generate a random ID
export const generateId = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Calculate attendance percentage
export const calculateAttendance = (present, total) => {
  if (total === 0) return "0%";

  return `${((present / total) * 100).toFixed(2)}%`;
};

// Get risk level based on percentage
export const getRiskLevel = (attendance) => {
  if (attendance >= 90) return "Low";
  if (attendance >= 75) return "Medium";
  return "High";
};

// Format full name
export const formatName = (firstName, lastName) => {
  return `${capitalize(firstName)} ${capitalize(lastName)}`;
};