import http from "../http";

// ✅ 관리자: 게시글 목록 (Page 반환)
// params 예: { page:0, size:20, includeDeleted:true, kw:"검색어" }
export const getAdminPosts = (params = {}) => {
  return http.get("/api/admin/posts", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      includeDeleted: params.includeDeleted ?? false, // ✅ 추가
      kw: params.kw ?? undefined,                     // ✅ 선택
    },
  });
};

// ✅ 관리자: 게시글 상세
export const getAdminPost = (postId) => {
  return http.get(`/api/admin/posts/${postId}`);
};

// ✅ 관리자: 게시글 soft delete
export const deleteAdminPost = (postId) => {
  return http.delete(`/api/admin/posts/${postId}`);
};

// ✅ 관리자: 게시글 restore
// ✅ 백엔드가 @PutMapping("/{postId}/restore") 이므로 PUT로 맞춤
export const restoreAdminPost = (postId) => {
  return http.put(`/api/admin/posts/${postId}/restore`);
};
