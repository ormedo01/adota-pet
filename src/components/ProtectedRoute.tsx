import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredType?: "adopter" | "ong" | "admin";
}

export const ProtectedRoute = ({ children, requiredType }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado mas o tipo não é o requerido
  if (requiredType && user?.type !== requiredType) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
            <CardDescription>
              Esta área é exclusiva para {requiredType === "ong" ? "ONGs" : requiredType === "admin" ? "administradores" : "adotantes"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Você está logado como <strong>{user?.type === "ong" ? "ONG" : user?.type === "admin" ? "Administrador" : "adotante"}</strong>.
              Para acessar esta página, você precisa fazer login com uma conta de {requiredType === "ong" ? "ONG" : requiredType === "admin" ? "Administrador" : "adotante"}.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link to={user?.type === "ong" ? "/ong-dashboard" : user?.type === "admin" ? "/admin/dashboard" : "/adopter-dashboard"}>
                  Ir para Meu Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Voltar para Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
