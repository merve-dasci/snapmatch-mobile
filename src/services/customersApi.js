import { apiRequest } from "./apiClient";

// Müşteri (workspace / tenant) yönetimi platform-admin kapsamındadır.
// Backend rotaların farklıysa sadece buradaki path'leri güncelle.
export const customersApi = {
    getCustomers() {
        return apiRequest(`/workspaces`);
    },

    createCustomer(data) {
        return apiRequest(`/workspaces`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    updateCustomer(id, data) {
        return apiRequest(`/workspaces/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    deleteCustomer(id) {
        return apiRequest(`/workspaces/${id}`, {
            method: "DELETE",
        });
    },
};