import { NewEmployee } from "../types";

export interface ValidationError {
  field: string;
  message: string;
}

// Form data type - extends NewEmployee but with string age for form handling
export interface EmployeeFormData extends Omit<NewEmployee, "age"> {
  age: string; // Form inputs are strings
}

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const generateEmployeeId = (): string => {
  const prefix = "EMP_";
  const randomNum = Math.floor(Math.random() * 1000000000);
  return prefix + randomNum;
};

// Convert form data to NewEmployee type
export const formDataToNewEmployee = (
  formData: EmployeeFormData
): NewEmployee => {
  return {
    name: formData.name.trim(),
    age: Number(formData.age),
    dateOfBirth: formData.dateOfBirth.trim(),
    employeeId: formData.employeeId.trim() || generateEmployeeId(),
  };
};

// Validation functions
export const validateEmployeeForm = (
  formData: EmployeeFormData
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!formData.name?.trim()) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (formData.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters",
    });
  }

  // Date of birth validation (primary validation)
  if (!formData.dateOfBirth?.trim()) {
    errors.push({
      field: "dateOfBirth",
      message: "Please select date of birth",
    });
  } else {
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    if (dob >= today) {
      errors.push({
        field: "dateOfBirth",
        message: "Date of birth must be in the past",
      });
    }
  }

  // Age validation (derived from date of birth)
  if (!formData.age?.trim() || isNaN(Number(formData.age))) {
    errors.push({
      field: "age",
      message: "Please select a valid date of birth",
    });
  } else {
    const age = Number(formData.age);
    if (age < 18 || age > 65) {
      errors.push({
        field: "age",
        message: "Employee age must be between 18 and 65",
      });
    }
  }

  return errors;
};
