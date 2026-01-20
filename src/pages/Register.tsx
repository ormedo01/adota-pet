import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Building2, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type UserType = "adopter" | "ong" | null;

const Register = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const [step, setStep] = useState<"select" | "form">("select");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Estados do formulário de adotante
  const [adopterData, setAdopterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cpf: "",
    birth_date: "",
    city: "",
    state: "",
  });

  // Estados do formulário de ONG
  const [ongData, setOngData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cnpj: "",
    description: "",
    city: "",
    state: "",
  });

  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    setStep("form");
  };

  const handleBack = () => {
    setStep("select");
    setUserType(null);
  };

  const handleAdopterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adopterData.password !== adopterData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: adopterData.email,
        password: adopterData.password,
        name: adopterData.name,
        user_type: "adopter",
        cpf: adopterData.cpf,
        birth_date: adopterData.birth_date || undefined,
        phone: adopterData.phone,
        city: adopterData.city,
        state: adopterData.state,
      });

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao AdotaPet!",
      });

      navigate("/adopter-dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar sua conta. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleONGSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ongData.password !== ongData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: ongData.email,
        password: ongData.password,
        name: ongData.name,
        user_type: "ong",
        cnpj: ongData.cnpj,
        description: ongData.description,
        phone: ongData.phone,
        city: ongData.city,
        state: ongData.state,
      });

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vinda ao AdotaPet!",
      });

      navigate("/ong-dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Não foi possível criar sua conta. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <div className="container py-12 flex items-center justify-center">
        {step === "select" ? (
          <div className="w-full max-w-4xl">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Bem-vindo ao AdotaPet!
              </h1>
              <p className="text-lg text-muted-foreground">
                Escolha como deseja se cadastrar
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Adotante */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary group"
                onClick={() => handleSelectUserType("adopter")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Quero Adotar</CardTitle>
                  <CardDescription className="text-base">
                    Procuro um novo companheiro para minha família
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Busque pets disponíveis para adoção</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Entre em contato direto com ONGs</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Acompanhe suas candidaturas</span>
                  </div>
                  <Button className="w-full mt-4" size="lg">
                    Cadastrar como Adotante
                  </Button>
                </CardContent>
              </Card>

              {/* Card ONG */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-secondary group"
                onClick={() => handleSelectUserType("ong")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Building2 className="h-10 w-10 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl">Sou uma ONG</CardTitle>
                  <CardDescription className="text-base">
                    Ajudo a conectar pets com famílias amorosas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Cadastre pets para adoção</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Gerencie candidaturas de adotantes</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Acompanhe estatísticas de adoção</span>
                  </div>
                  <Button className="w-full mt-4" variant="secondary" size="lg">
                    Cadastrar como ONG
                  </Button>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Já tem conta?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        ) : (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="w-fit mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  userType === "adopter" 
                    ? "bg-primary/10" 
                    : "bg-secondary/10"
                }`}>
                  {userType === "adopter" ? (
                    <User className="h-6 w-6 text-primary" />
                  ) : (
                    <Building2 className="h-6 w-6 text-secondary" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {userType === "adopter" ? "Cadastro de Adotante" : "Cadastro de ONG"}
                  </CardTitle>
                  <CardDescription>
                    Preencha seus dados para criar sua conta
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {userType === "adopter" ? (
                // Formulário Adotante
                <form className="space-y-4" onSubmit={handleAdopterSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input 
                      id="name" 
                      placeholder="João Silva" 
                      value={adopterData.name}
                      onChange={(e) => setAdopterData({...adopterData, name: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={adopterData.email}
                      onChange={(e) => setAdopterData({...adopterData, email: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="(11) 98765-4321" 
                        value={adopterData.phone}
                        onChange={(e) => setAdopterData({...adopterData, phone: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input 
                        id="cpf" 
                        placeholder="000.000.000-00" 
                        value={adopterData.cpf}
                        onChange={(e) => setAdopterData({...adopterData, cpf: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Data de Nascimento (opcional)</Label>
                    <Input 
                      id="birth_date" 
                      type="date" 
                      value={adopterData.birth_date}
                      onChange={(e) => setAdopterData({...adopterData, birth_date: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input 
                        id="city" 
                        placeholder="São Paulo" 
                        value={adopterData.city}
                        onChange={(e) => setAdopterData({...adopterData, city: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado *</Label>
                      <Input 
                        id="state" 
                        placeholder="SP" 
                        maxLength={2} 
                        value={adopterData.state}
                        onChange={(e) => setAdopterData({...adopterData, state: e.target.value.toUpperCase()})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={adopterData.password}
                      onChange={(e) => setAdopterData({...adopterData, password: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      value={adopterData.confirmPassword}
                      onChange={(e) => setAdopterData({...adopterData, confirmPassword: e.target.value})}
                      required 
                    />
                  </div>

                  <Separator />

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Ou cadastre-se com
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant="outline">Google</Button>
                    <Button type="button" variant="outline">Facebook</Button>
                  </div>
                </form>
              ) : (
                // Formulário ONG
                <form className="space-y-4" onSubmit={handleONGSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="ongName">Nome da ONG *</Label>
                    <Input 
                      id="ongName" 
                      placeholder="ONG Patinhas Felizes" 
                      value={ongData.name}
                      onChange={(e) => setOngData({...ongData, name: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input 
                        id="cnpj" 
                        placeholder="00.000.000/0000-00" 
                        value={ongData.cnpj}
                        onChange={(e) => setOngData({...ongData, cnpj: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ongPhone">Telefone *</Label>
                      <Input 
                        id="ongPhone" 
                        type="tel" 
                        placeholder="(11) 3456-7890" 
                        value={ongData.phone}
                        onChange={(e) => setOngData({...ongData, phone: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ongEmail">Email da ONG *</Label>
                    <Input 
                      id="ongEmail" 
                      type="email" 
                      placeholder="contato@ong.com" 
                      value={ongData.email}
                      onChange={(e) => setOngData({...ongData, email: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Sobre a ONG *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Conte um pouco sobre a história e missão da ONG..."
                      rows={4}
                      value={ongData.description}
                      onChange={(e) => setOngData({...ongData, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ongCity">Cidade *</Label>
                      <Input 
                        id="ongCity" 
                        placeholder="São Paulo" 
                        value={ongData.city}
                        onChange={(e) => setOngData({...ongData, city: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ongState">Estado *</Label>
                      <Input 
                        id="ongState" 
                        placeholder="SP" 
                        maxLength={2} 
                        value={ongData.state}
                        onChange={(e) => setOngData({...ongData, state: e.target.value.toUpperCase()})}
                        required 
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="ongPassword">Senha *</Label>
                    <Input 
                      id="ongPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      value={ongData.password}
                      onChange={(e) => setOngData({...ongData, password: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ongConfirmPassword">Confirmar Senha *</Label>
                    <Input 
                      id="ongConfirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      value={ongData.confirmPassword}
                      onChange={(e) => setOngData({...ongData, confirmPassword: e.target.value})}
                      required 
                    />
                  </div>

                  <Separator />

                  <Button type="submit" className="w-full" size="lg" variant="secondary" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar Conta da ONG"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Ou cadastre-se com
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant="outline">Google</Button>
                    <Button type="button" variant="outline">Facebook</Button>
                  </div>
                </form>
              )}

              <p className="text-xs text-center text-muted-foreground mt-4">
                Ao criar uma conta, você concorda com nossos{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Register;
