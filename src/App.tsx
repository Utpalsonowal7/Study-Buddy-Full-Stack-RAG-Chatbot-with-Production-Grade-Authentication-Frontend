import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { Route, Routes } from "react-router";

function App() {
     return (
          <>
               <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<ProtectedRoute />}>
                         <Route element={<AppLayout />}>
                              <Route path="/home" element={<Dashboard />} />
                         </Route>
                    </Route>
               </Routes>
          </>
     );
}

export default App;
