import { Routes, Route,Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn/SignIn'
import MemberEdit from './pages/MyPage/MemberEdit'
import SignUp from './pages/SignUp/SignUp'
import DashBoard from './pages/DashBoard/AdminDashboard'
import MainBoard from './pages/MainBoard/MainBoard'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/board" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/edit" element={<MemberEdit />} />
      <Route path="/admin/*" element={<DashBoard />} />
      <Route path="/board/*" element={<MainBoard />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  )
}
