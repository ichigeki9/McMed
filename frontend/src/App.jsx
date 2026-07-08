import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import CourseList from './pages/admin/CourseList'
import CourseCreate from './pages/admin/CourseCreate'
import CourseDetail from './pages/admin/CourseDetail'
import ParticipantList from './pages/admin/ParticipantList'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import EnrollForm from './pages/participant/EnrollForm'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Formularz publiczny */}
        <Route path="/zapisz-sie" element={<EnrollForm />} />

        {/* Panel właściciela */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/create" element={<CourseCreate />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="participants" element={<ParticipantList />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
