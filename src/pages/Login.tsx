import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"adopter" | "ong">("adopter");
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, userType);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo${userType === "ong" ? "a" : ""} de volta!`,
        });
        
        // Redireciona para o dashboard apropriado
        navigate(userType === "ong" ? "/ong-dashboard" : "/adopter-dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Email ou senha incorretos.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <div className="container py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>
            <CardTitle className="text-2xl">Bem-vindo de volta!</CardTitle>
            <CardDescription>
              Entre para continuar conectando pets e adotantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={userType} onValueChange={(value) => setUserType(value as "adopter" | "ong")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="adopter" className="gap-2">
                  <User className="h-4 w-4" />
                  Adotante
                </TabsTrigger>
                <TabsTrigger value="ong" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  ONG
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="adopter" className="space-y-4 mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-adopter">Email</Label>
                    <Input 
                      id="email-adopter" 
                      type="email" 
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-adopter">Senha</Label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Esqueceu?
                      </Link>
                    </div>
                    <Input 
                      id="password-adopter" 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar como Adotante"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="ong" className="space-y-4 mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-ong">Email da ONG</Label>
                    <Input 
                      id="email-ong" 
                      type="email" 
                      placeholder="contato@ong.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-ong">Senha</Label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Esqueceu?
                      </Link>
                    </div>
                    <Input 
                      id="password-ong" 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button className="w-full" size="lg" type="submit" variant="secondary" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar como ONG"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button">Google</Button>
              <Button variant="outline" type="button">Facebook</Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
