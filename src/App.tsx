import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import HireUs from './pages/HireUs';
import Contact from './pages/Contact';
import Research from './pages/Research';
import Training from './pages/Training';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import ChatWidget from './components/Chat/ChatWidget';
import { Toaster } from 'react-hot-toast'; // I'll install this next

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/hire" element={<HireUs />} />
            <Route path="/research" element={<Research />} />
            <Route path="/training" element={<Training />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}
