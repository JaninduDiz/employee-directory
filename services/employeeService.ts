import AsyncStorage from "@react-native-async-storage/async-storage";
import { Employee, NewEmployee } from "@/types";
import { INITIAL_EMPLOYEES } from "@/constants/EmployeeList";
import { EMPLOYEE_COUNT } from "@/constants";

const STORAGE_KEY = "@employees";

export class EmployeeService {
  static async initializeEmployees(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (!stored) {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(INITIAL_EMPLOYEES)
        );
      }
    } catch (error) {
      console.error("Failed to initialize employees:", error);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(INITIAL_EMPLOYEES)
      );
    }
  }

  static async getAllEmployees(): Promise<Employee[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to get employees:", error);
      return [];
    }
  }

  static async getLatestEmployees(
    count: number = EMPLOYEE_COUNT
  ): Promise<Employee[]> {
    try {
      const employees = await this.getAllEmployees();

      return employees
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, count);
    } catch (error) {
      console.error("Failed to get latest employees:", error);
      return [];
    }
  }

  // CRUD operations
  static async addEmployee(
    newEmployee: NewEmployee,
    existingEmployees?: Employee[]
  ): Promise<Employee[]> {
    try {
      const employees = existingEmployees || (await this.getAllEmployees());
      const employee: Employee = {
        ...newEmployee,
        age: Number(newEmployee.age),
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      employees.push(employee);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
      return employees;
    } catch (error) {
      console.error("Failed to add employee:", error);
      throw error;
    }
  }

  static async updateEmployee(
    updatedEmployee: Employee,
    existingEmployees?: Employee[]
  ): Promise<Employee[]> {
    try {
      const employees = existingEmployees || (await this.getAllEmployees());
      const index = employees.findIndex((emp) => emp.id === updatedEmployee.id);
      if (index !== -1) {
        employees[index] = updatedEmployee;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        return employees;
      } else {
        throw new Error(`Employee with ID ${updatedEmployee.id} not found`);
      }
    } catch (error) {
      console.error("Failed to update employee:", error);
      throw error;
    }
  }

  static async deleteEmployee(
    employeeId: string,
    existingEmployees?: Employee[]
  ): Promise<Employee[]> {
    try {
      const employees = existingEmployees || (await this.getAllEmployees());
      const filtered = employees.filter((emp) => emp.id !== employeeId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    } catch (error) {
      console.error("Failed to delete employee:", error);
      throw error;
    }
  }

  static async clearEmployees(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear employee storage:", error);
    }
  }

  static async resetEmployees(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(INITIAL_EMPLOYEES)
      );
    } catch (error) {
      console.error("Failed to reset employees:", error);
    }
  }

  static async searchEmployees(
    query: string,
    limit?: number
  ): Promise<Employee[]> {
    try {
      if (!query.trim()) {
        return this.getLatestEmployees(limit);
      }

      const allEmployees = await this.getAllEmployees();
      const searchTerm = query.toLowerCase().trim();

      const filteredEmployees = allEmployees.filter((employee) => {
        return (
          employee.name.toLowerCase().includes(searchTerm) ||
          employee.employeeId.toLowerCase().includes(searchTerm) ||
          employee.age.toString().includes(searchTerm)
        );
      });

      const sortedResults = filteredEmployees.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      return limit ? sortedResults.slice(0, limit) : sortedResults;
    } catch (error) {
      console.error("Failed to search employees:", error);
      return [];
    }
  }

  static async getEmployeesByName(name: string): Promise<Employee[]> {
    try {
      const allEmployees = await this.getAllEmployees();
      const searchTerm = name.toLowerCase().trim();

      return allEmployees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error("Failed to search employees by name:", error);
      return [];
    }
  }

  static async getEmployeeById(employeeId: string): Promise<Employee | null> {
    try {
      const allEmployees = await this.getAllEmployees();
      return (
        allEmployees.find(
          (employee) =>
            employee.employeeId.toLowerCase() === employeeId.toLowerCase()
        ) || null
      );
    } catch (error) {
      console.error("Failed to get employee by ID:", error);
      return null;
    }
  }
}
