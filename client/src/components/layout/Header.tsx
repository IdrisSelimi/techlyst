import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600">
          Techlyst
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-primary-600">
            Home
          </Link>
          <Link to="/categories" className="text-gray-700 hover:text-primary-600">
            Categories
          </Link>
          <Link to="/search" className="text-gray-700 hover:text-primary-600">
            Search
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <span>{user.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  {user.role === 'seller' || user.role === 'admin' ? (
                    <Link to="/my-listings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Listings
                    </Link>
                  ) : (
                    <Link to="/become-seller" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Become a Seller
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary-600">
                Login
              </Link>
              <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 