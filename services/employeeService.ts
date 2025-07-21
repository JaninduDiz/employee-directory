import AsyncStorage from "@react-native-async-storage/async-storage";
import { Employee, NewEmployee } from "@/types";
import { INITIAL_EMPLOYEES } from "@/constants/EmployeeList";
import { EMPLOYEE_COUNT } from "@/constants";

const STORAGE_KEY = "@employees";

export class EmployeeService {
  static async initializeEmployees(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      console.log(
        "Initializing employees, current storage:",
        stored ? "exists" : "empty"
      );

      if (!stored) {
        // First time - store initial data
        console.log(`Storing ${INITIAL_EMPLOYEES.length} initial employees`);
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(INITIAL_EMPLOYEES)
        );
      } else {
        const employees = JSON.parse(stored);
        console.log(`Found ${employees.length} employees in storage`);
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

  static async getLatestEmployees(
    count: number = EMPLOYEE_COUNT
  ): Promise<Employee[]> {
    try {
      const employees = await this.getAllEmployees();
      console.log(
        `Total employees in storage: ${employees.length}, Requesting: ${count}`
      );

      // Simply return the first N employees sorted alphabetically by name
      // If there are fewer employees than requested, just return what we have
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
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let deletedCount = 0;
      if (stored) {
        const employees: Employee[] = JSON.parse(stored);
        deletedCount = employees.length;
      }
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log(`Cleared ${deletedCount} employees from storage`);
    } catch (error) {
      console.error("Failed to clear employee storage:", error);
    }
  }

  static async resetEmployees(): Promise<void> {
    try {
      console.log("Resetting employees to initial data...");
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(INITIAL_EMPLOYEES)
      );
      console.log(
        `Reset complete: ${INITIAL_EMPLOYEES.length} employees stored`
      );
    } catch (error) {
      console.error("Failed to reset employees:", error);
    }
  }
}
