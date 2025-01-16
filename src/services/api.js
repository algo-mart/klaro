const BASE_URL = "/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  try {
    const contentType = response.headers.get("content-type");
    const data =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      const errorMessage =
        typeof data === "object" && data.message
          ? data.message
          : `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (e) {
    console.error("Error handling response:", e);
    throw e;
  }
};

// Common fetch options
const commonFetchOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// API Service object
const apiService = {
  // Participant Management
  participants: {
    // Create a new participant
    create: async (participantData) => {
      console.log(participantData);
      try {
        const response = await fetch(`${BASE_URL}/participants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: participantData,
        });

        const data = await response.json();

        console.log(data.name, JSON.parse(participantData).name);
        console.log(data.name != JSON.parse(participantData).name);
        // if (data.name == JSON.parse(participantData).name) {
        //   throw new Error(data.message || "Failed to add participant");
        // }

        return {
          status: "Success",
          data: data,
        };
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },

    // Get all participants
    getAll: async () => {
      try {
        const response = await fetch(`${BASE_URL}/participants`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch participants");
        }

        return data.data || [];
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },

    // Get a participant by ID
    getById: async (id) => {
      try {
        const response = await fetch(`${BASE_URL}/participants/${id}`, {
          ...commonFetchOptions,
          method: "GET",
        });
        return handleResponse(response);
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },

    // Update a participant
    update: async (id, participantData) => {
      try {
        // Validate required fields
        if (
          !participantData.name ||
          !participantData.phoneNumber ||
          !participantData.email
        ) {
          throw new Error("Name, phone number, and email are required");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(participantData.email)) {
          throw new Error("Invalid email format");
        }

        const sanitizedData = {
          name: participantData.name.trim(),
          phoneNumber: participantData.phoneNumber.trim(),
          email: participantData.email.trim().toLowerCase(),
          address: participantData.address?.trim() || "",
          category: participantData.category || "MEMBER",
        };

        const response = await fetch(`${BASE_URL}/participants/${id}`, {
          ...commonFetchOptions,
          method: "PUT",
          body: JSON.stringify(sanitizedData),
        });
        return handleResponse(response);
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },

    // Delete a participant
    delete: async (id) => {
      try {
        const response = await fetch(`${BASE_URL}/participants/${id}`, {
          ...commonFetchOptions,
          method: "DELETE",
        });
        return handleResponse(response);
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },
  },

  // Attendance Management
  attendance: {
    // Record attendance
    record: async (attendanceData) => {
      try {
        // For now, store attendance in localStorage until backend is ready
        const key = `attendance_${attendanceData.date}_${attendanceData.participantId}`;
        localStorage.setItem(key, JSON.stringify(attendanceData));
        return attendanceData;
      } catch (error) {
        console.error("API Error:", error);
        throw new Error("Failed to record attendance");
      }
    },

    // Get all attendance records
    getAll: async (date) => {
      try {
        // For now, get from localStorage until backend is ready
        const records = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith("attendance_")) {
            const record = JSON.parse(localStorage.getItem(key));
            if (!date || record.date === date) {
              records.push(record);
            }
          }
        }
        return records;
      } catch (error) {
        console.error("API Error:", error);
        return [];
      }
    },

    // Get attendance by participant ID
    getByParticipant: async (participantId) => {
      try {
        // For now, get from localStorage until backend is ready
        const records = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith("attendance_")) {
            const record = JSON.parse(localStorage.getItem(key));
            if (record.participantId === participantId) {
              records.push(record);
            }
          }
        }
        return records;
      } catch (error) {
        console.error("API Error:", error);
        return [];
      }
    },

    // Get attendance by date
    getByDate: async (date) => {
      try {
        // For now, get from localStorage until backend is ready
        const records = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith("attendance_")) {
            const record = JSON.parse(localStorage.getItem(key));
            if (record.date === date) {
              records.push(record);
            }
          }
        }
        return records;
      } catch (error) {
        console.error("API Error:", error);
        return [];
      }
    },
  },

  // Payment Management
  payments: {
    // Record payment
    record: async (paymentData) => {
      try {
        const response = await fetch(`${BASE_URL}/payments`, {
          ...commonFetchOptions,
          method: "POST",
          body: JSON.stringify(paymentData),
        });
        return handleResponse(response);
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },

    // Get payment records
    getAll: async () => {
      try {
        const response = await fetch(`${BASE_URL}/payments`, {
          ...commonFetchOptions,
          method: "GET",
        });
        return handleResponse(response);
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },
  },
};

export default apiService;
