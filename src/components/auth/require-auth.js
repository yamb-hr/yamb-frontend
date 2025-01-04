import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import authService from '../../services/authService';
import Spinner from '../spinner/spinner';

function RequireAuth() {
    
    const { currentUser, loading } = useContext(CurrentUserContext);

    if (loading) {
        return <Spinner />;
    }

    if (!currentUser && !authService.getAccessToken()) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default RequireAuth;
