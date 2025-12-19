import http from '../http';

export const getAdminFiles = (params = {}) => {
  return http.get('/api/admin/files', {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      includeDeleted: params.includeDeleted ?? false,
    },
  });
};

export const getAdminFile = (fileId) => http.get(`/api/admin/files/${fileId}`);

export const updateAdminFile = (fileId, data) =>
  http.put(`/api/admin/files/${fileId}`, data);

export const deleteAdminFile = (fileId) =>
  http.delete(`/api/admin/files/${fileId}`);

export const restoreAdminFile = (fileId) =>
  http.put(`/api/admin/files/${fileId}/restore`);
