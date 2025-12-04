import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    name: string;
    id: string;
    clearance: string;
    level: number;
    xp: number;
}

interface AuthContextType {
    user: User | null;
    login: (name: string, id: string) => void;
    logout: () => void;
    addXp: (amount: number) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('cyber_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (name: string, id: string) => {
        const newUser = { name, id, clearance: 'LEVEL 5', level: 1, xp: 0 };
        setUser(newUser);
        localStorage.setItem('cyber_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cyber_user');
    };

    const addXp = (amount: number) => {
        setUser(currentUser => {
            if (!currentUser) return null;

            const newXp = (currentUser.xp || 0) + amount;
            const newLevel = Math.floor(newXp / 50) + 1;

            const updatedUser = { ...currentUser, xp: newXp, level: newLevel };
            localStorage.setItem('cyber_user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, addXp, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
