import http from '../http'

// ✅ 게시글 목록(공개/일반)
export const getBoardPosts = (params = {}) =>
  http.get('/posts', { params })

// ✅ 게시글 상세(공개/일반)
export const getBoardPost = (postId) =>
  http.get(`/posts/${postId}`)

// ✅ 게시글 작성(로그인 필요)
export const createBoardPost = (data) =>
  http.post('/posts', data)

// ✅ 게시글 수정(본인 또는 권한)
export const updateBoardPost = (postId, data) =>
  http.put(`/posts/${postId}`, data)

// ✅ 게시글 삭제(본인 또는 권한)
export const deleteBoardPost = (postId) =>
  http.delete(`/posts/${postId}`)
