import http from '../http';

export const getAdminSummary = () => {
  return http.get('/api/admin/summary');
};
