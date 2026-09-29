// Check if a field is empty
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== "";
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

// Validate password
// Minimum 8 characters, at least one uppercase,
// one lowercase, one number and one special character
export const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  return passwordRegex.test(password);
};

// Validate phone number (10 digits)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Validate name (letters and spaces only)
export const isValidName = (name) => {
  const nameRegex = /^[A-Za-z ]+$/;
  return nameRegex.test(name.trim());
};

// Validate roll number (letters, numbers and hyphen)
export const isValidRollNumber = (rollNumber) => {
  const rollRegex = /^[A-Za-z0-9-]+$/;
  return rollRegex.test(rollNumber);
};