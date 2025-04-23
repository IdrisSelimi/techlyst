import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './hooks/useAppDispatch';
import { getProfile } from './store/slices/authSlice';
import Layout from './components/layout/Layout';

// Placeholder components (to be built later)
const HomePage = () => <div className="container mx-auto p-4">Home Page</div>;
const NotFoundPage = () => <div className="container mx-auto p-4">404 - Page Not Found</div>;

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check for logged in user
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
