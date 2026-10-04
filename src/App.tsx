import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { Navigate, Route, Routes } from "react-router";

function App() {
     return (
          <>
               <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                         <Route element={<AppLayout />}>
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/home" element={<Navigate to="/dashboard" replace />} />
                              <Route path="/chat" element={<Chat />} />
                              <Route path="/chat/:chatId" element={<Chat />} />
                              <Route path="/documents" element={<Documents />} />
                              <Route path="/settings" element={<Settings />} />
                         </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
               </Routes>
          </>
     );
}

export default App;
