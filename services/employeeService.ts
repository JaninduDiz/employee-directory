import AsyncStorage from "@react-native-async-storage/async-storage";
import { Employee, NewEmployee } from "@/types";
import { INITIAL_EMPLOYEES } from "@/constants/EmployeeList";

const STORAGE_KEY = "@employees";

export class EmployeeService {
  static async initializeEmployees(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // First time - store initial data
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(INITIAL_EMPLOYEES)
        );
      }
    } catch (error) {
      console.error("Failed to initialize employees:", error);
      // Even if there's an error, try to store initial data
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

  static async getLatestEmployees(count: number = 10): Promise<Employee[]> {
    try {
      const employees = await this.getAllEmployees();

      // Get latest employees by creation date, then sort alphabetically by name
      return employees
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, count)
        .sort((a, b) => a.name.localeCompare(b.name));
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
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let deletedCount = 0;
      if (stored) {
        const employees: Employee[] = JSON.parse(stored);
        deletedCount = employees.length;
      }
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear employee storage:", error);
    }
  }
}
