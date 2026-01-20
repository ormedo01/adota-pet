import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authService, type User as ApiUser } from "@/lib/api";

type UserType = "adopter" | "ong";

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  city?: string;
  state?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, type: UserType) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Converter User da API para User do contexto
const mapApiUserToContextUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  type: apiUser.user_type,
  cpf: apiUser.cpf,
  cnpj: apiUser.cnpj,
  phone: apiUser.phone,
  city: apiUser.city,
  state: apiUser.state,
  description: apiUser.description,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se já existe um usuário logado ao carregar
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(mapApiUserToContextUser(currentUser));
        }
      } catch (error) {
        console.error('Erro ao recuperar usuário:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, type: UserType): Promise<void> => {
    try {
      const response = await authService.login(email, password, type);
      const contextUser = mapApiUserToContextUser(response.user);
      setUser(contextUser);
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(
        error.response?.data?.message || 
        'Erro ao fazer login. Verifique suas credenciais.'
      );
    }
  };

  const register = async (userData: any): Promise<void> => {
    try {
      const response = await authService.register(userData);
      const contextUser = mapApiUserToContextUser(response.user);
      setUser(contextUser);
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(
        error.response?.data?.message || 
        'Erro ao criar conta. Tente novamente.'
      );
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
