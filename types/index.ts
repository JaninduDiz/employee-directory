export interface Quote {
  quote: string;
  author: string;
}

export interface Employee {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string;
  employeeId: string;
  createdAt: string;
}

export interface EmployeeFormData {
  name: string;
  age: string;
  dateOfBirth: string;
  employeeId: string;
}
