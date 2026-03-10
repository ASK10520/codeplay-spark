import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Courses from "./pages/Courses";
import CurriculumCatalog from "./pages/CurriculumCatalog";
import CurriculumCourseDetail from "./pages/CurriculumCourseDetail";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import Achievements from "./pages/Achievements";
import LessonPlayground from "./pages/LessonPlayground";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AboutUs from "./pages/AboutUs";
import AdminOverview from "./pages/AdminOverview";
import AdminPayments from "./pages/AdminPayments";
import AdminCourses from "./pages/AdminCourses";
import AdminStudents from "./pages/AdminStudents";
import AdminEnrollments from "./pages/AdminEnrollments";
import AdminInstructors from "./pages/AdminInstructors";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminCurriculum from "./pages/AdminCurriculum";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminPlaceholder from "./pages/AdminPlaceholder";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/curriculum" element={<CurriculumCatalog />} />
            <Route path="/curriculum/:id" element={<CurriculumCourseDetail />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/lesson/:id" element={<LessonPlayground />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/about" element={<AboutUs />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/enrollments" element={<AdminEnrollments />} />
            <Route path="/admin/instructors" element={<AdminInstructors />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/curriculum" element={<AdminCurriculum />} />
            <Route path="/admin/certificates" element={<AdminPlaceholder />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/messages" element={<AdminPlaceholder />} />
            <Route path="/admin/reviews" element={<AdminPlaceholder />} />
            <Route path="/admin/content" element={<AdminPlaceholder />} />
            <Route path="/admin/roles" element={<AdminPlaceholder />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/activity-logs" element={<AdminPlaceholder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
