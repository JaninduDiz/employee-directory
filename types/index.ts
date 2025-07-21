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

export interface NewEmployee {
  name: string;
  age: number;
  dateOfBirth: string;
  employeeId: string;
}
