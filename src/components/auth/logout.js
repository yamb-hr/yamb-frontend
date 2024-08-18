import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        AuthService.logout();  // Clear local storage
        navigate('/login');    // Redirect to the login page
    }, [navigate]);

    return null;
}

export default Logout;
