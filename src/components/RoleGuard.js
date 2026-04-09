import { useAuth } from '../store/AuthContext';

const RoleGuard = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return children;
};

export default RoleGuard;