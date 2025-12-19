import http from '../http';

// ✅ 관리자: 사용자 목록 (Page 반환)
export const getAdminUsers = (params = {}) => {
  // params: { includeDeleted, page, size }
  return http.get('/api/admin/users', { params });
};

// ✅ 관리자: 사용자 상세
export const getAdminUser = (memberId) => {
  return http.get(`/api/admin/users/${memberId}`);
};

// ✅ 관리자: 사용자 role 변경
export const changeAdminUserRole = (memberId, role) => {
  return http.patch(`/api/admin/users/${memberId}/role`, { role });
};

// ✅ 관리자: 사용자 soft delete
export const deleteAdminUser = (memberId) => {
  return http.delete(`/api/admin/users/${memberId}`);
};

// ✅ 관리자: 사용자 restore
export const restoreAdminUser = (memberId) => {
  return http.patch(`/api/admin/users/${memberId}/restore`);
};
