import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, lazy, Suspense } from 'react';
import { BookContext } from './context/BookContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'sonner';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SecretEntry = lazy(() => import('./pages/SecretEntry'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }) => {
    const { isAdmin } = useContext(BookContext);
    return isAdmin ? children : <Navigate to="/admin-login" />;
};

function App() {
    return (
        <Router>
            <div className="app-wrapper">
                <Toaster position="top-right" richColors />
                <Navbar />
                <main style={{ minHeight: '80vh' }}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/product/:id" element={<BookDetail />} />
                            <Route path="/admin-login" element={<AdminLogin />} />
                            <Route path="/secret" element={<SecretEntry />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/admin" element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
