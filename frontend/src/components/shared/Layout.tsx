import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { useUser } from '@/services/auth.service';
export const Layout = () => {
  const { userData } = useUser();
  const {isAuthenticated, logout} = useAuth();
  const navigate = useNavigate();

  const user = userData?.data;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            MyApp
          </Link>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <span>Welcome, {user?.username}</span>
                <button onClick={handleLogout} className="text-red-500">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}; 