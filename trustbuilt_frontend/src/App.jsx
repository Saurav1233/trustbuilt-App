import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import AboutUs from './pages/AboutUs';
import Franchise from './pages/Franchise';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />
              <Route path="/services"   element={<Services />} />
              <Route path="/contact"    element={<Contact />} />
              <Route path="/portfolio"  element={<Portfolio />} />
              <Route path="/about-us"   element={<AboutUs />} />
              <Route path="/franchise"  element={<Franchise />} />
              <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin-panel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

// function App() {
//   return (
//     <div style={{textAlign: "center", marginTop: "100px"}}>
//       <h1>🚧 Site Under Maintenance</h1>
//       <p>We’ll be back soon.</p>
//     </div>
//   );
// }

// export default App;