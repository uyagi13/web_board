import http from '../http'

// ✅ 특정 게시글 댓글 목록
export const getComments = (postId, params = {}) =>
  http.get(`/posts/${postId}/comments`, { params })

// ✅ 댓글 작성
export const createComment = (postId, data) =>
  http.post(`/posts/${postId}/comments`, data)

// ✅ 댓글 수정
export const updateComment = (commentId, data) =>
  http.put(`/comments/${commentId}`, data)

// ✅ 댓글 삭제
export const deleteComment = (commentId) =>
  http.delete(`/comments/${commentId}`)
