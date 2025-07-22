import { create } from "zustand";
import { Employee, NewEmployee } from "../types";
import { EmployeeService } from "../services/employeeService";
import { EMPLOYEE_COUNT } from "../constants";

interface EmployeeStore {
  latestEmployees: Employee[];
  searchResults: Employee[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  searchQuery: string;

  initializeEmployees: () => Promise<void>;
  addEmployee: (employee: NewEmployee) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (employeeId: string) => Promise<void>;
  getLatestEmployees: (count?: number) => Promise<Employee[]>;
  searchEmployees: (query: string, limit?: number) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
  clearEmployees: () => void;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  latestEmployees: [],
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null,
  searchQuery: "",

  initializeEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await EmployeeService.initializeEmployees();
      set({ isLoading: false });
    } catch (error) {
      set({ error: "Failed to initialize employees", isLoading: false });
    }
  },

  addEmployee: async (newEmployee: NewEmployee) => {
    try {
      const allEmployees = await EmployeeService.getAllEmployees();
      await EmployeeService.addEmployee(newEmployee, allEmployees);

      const freshLatestEmployees = await EmployeeService.getLatestEmployees(
        EMPLOYEE_COUNT
      );

      set({ latestEmployees: freshLatestEmployees, error: null });

      const { searchQuery } = get();
      if (searchQuery.trim()) {
        const searchResults = await EmployeeService.searchEmployees(
          searchQuery
        );
        set({ searchResults });
      }
    } catch (error) {
      set({ error: "Failed to add employee" });
      throw error;
    }
  },

  updateEmployee: async (updatedEmployee: Employee) => {
    try {
      const allEmployees = await EmployeeService.getAllEmployees();
      await EmployeeService.updateEmployee(updatedEmployee, allEmployees);

      const freshLatestEmployees = await EmployeeService.getLatestEmployees(
        EMPLOYEE_COUNT
      );

      set({ latestEmployees: freshLatestEmployees, error: null });

      const { searchQuery } = get();
      if (searchQuery.trim()) {
        const searchResults = await EmployeeService.searchEmployees(
          searchQuery
        );
        set({ searchResults });
      }
    } catch (error) {
      set({ error: "Failed to update employee" });
      throw error;
    }
  },

  deleteEmployee: async (employeeId: string) => {
    try {
      const allEmployees = await EmployeeService.getAllEmployees();
      await EmployeeService.deleteEmployee(employeeId, allEmployees);

      const freshLatestEmployees = await EmployeeService.getLatestEmployees(
        EMPLOYEE_COUNT
      );
      set({ latestEmployees: freshLatestEmployees, error: null });

      const { searchQuery } = get();
      if (searchQuery.trim()) {
        const searchResults = await EmployeeService.searchEmployees(
          searchQuery
        );
        set({ searchResults });
      }
    } catch (error) {
      set({ error: "Failed to delete employee" });
      throw error;
    }
  },

  getLatestEmployees: async (count = EMPLOYEE_COUNT) => {
    try {
      // Fetch latest employees directly from storage, sorted alphabetically
      const latestEmployees = await EmployeeService.getLatestEmployees(count);
      set({ latestEmployees });
      return latestEmployees;
    } catch (error) {
      set({ error: "Failed to get latest employees" });
      return [];
    }
  },

  searchEmployees: async (query: string, limit?: number) => {
    try {
      set({ isSearching: true, error: null, searchQuery: query });

      await new Promise((resolve) => setTimeout(resolve, 300));

      const searchResults = await EmployeeService.searchEmployees(query, limit);

      set({
        searchResults,
        isSearching: false,
        searchQuery: query,
      });
    } catch (error) {
      set({
        error: "Failed to search employees",
        isSearching: false,
        searchResults: [],
      });
    }
  },

  clearSearch: () => {
    set({
      searchResults: [],
      searchQuery: "",
      isSearching: false,
    });
  },

  clearError: () => set({ error: null }),

  clearEmployees: async () => {
    set({ latestEmployees: [], searchResults: [], error: null });
    try {
      await EmployeeService.clearEmployees();
    } catch (error) {
      set({ error: "Failed to clear employees" });
    }
  },
}));
