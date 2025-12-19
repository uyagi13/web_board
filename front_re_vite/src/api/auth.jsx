import http from './http'

export const login = (data) => http.post('/auth/login', data)
export const signup = (data) => http.post('/auth/signup', data)
export const me = () => http.get('/auth/me')

