import http from '../http'

// 관리자 대시보드 요약(유저 수, 게시글 수, 신고 수 등)
export const getDashboard = () => http.get('/admin/dashboard')
