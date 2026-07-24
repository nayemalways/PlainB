import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './features/auth/components/AuthProvider.tsx';
import { router } from './app/router/router.tsx';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
