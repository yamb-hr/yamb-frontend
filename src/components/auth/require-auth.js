import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CurrentUserContext } from '../../providers/currentUserProvider';
import Spinner from '../spinner/spinner';

function RequireAuth() {
    
    const { currentUser, loading } = useContext(CurrentUserContext);

    if (loading) {
        return <Spinner />;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default RequireAuth;
