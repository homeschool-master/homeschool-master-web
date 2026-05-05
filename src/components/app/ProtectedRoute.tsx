import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../store';

const ProtectedRoutes = () => {
  const token = useSelector((state: RootState) => state.auth.token)

return (
    token ? <Outlet/> : <Navigate to='/login'/>
  )
};

export default ProtectedRoutes;