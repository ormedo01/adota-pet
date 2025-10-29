import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { Heart, Building2, User, ArrowLeft, CheckCircle2 } from "lucide-react";

type UserType = "adopter" | "ong" | null;

const Register = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const [step, setStep] = useState<"select" | "form">("select");

  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    setStep("form");
  };

  const handleBack = () => {
    setStep("select");
    setUserType(null);
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
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome *</Label>
                      <Input id="firstName" placeholder="João" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome *</Label>
                      <Input id="lastName" placeholder="Silva" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input id="phone" type="tel" placeholder="(11) 98765-4321" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input id="cpf" placeholder="000.000.000-00" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço *</Label>
                    <Input id="address" placeholder="Rua, número, complemento" required />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input id="city" placeholder="São Paulo" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado *</Label>
                      <Input id="state" placeholder="SP" maxLength={2} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP *</Label>
                      <Input id="zipCode" placeholder="00000-000" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Moradia *</Label>
                    <RadioGroup defaultValue="house">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="house" id="house" />
                        <Label htmlFor="house" className="font-normal cursor-pointer">
                          Casa
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apartment" id="apartment" />
                        <Label htmlFor="apartment" className="font-normal cursor-pointer">
                          Apartamento
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input id="password" type="password" placeholder="••••••••" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" required />
                  </div>

                  <Separator />

                  <Button type="submit" className="w-full" size="lg">
                    Criar Conta
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
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ongName">Nome da ONG *</Label>
                    <Input id="ongName" placeholder="ONG Patinhas Felizes" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input id="cnpj" placeholder="00.000.000/0000-00" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="foundingYear">Ano de Fundação *</Label>
                      <Input id="foundingYear" type="number" placeholder="2020" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ongEmail">Email da ONG *</Label>
                    <Input id="ongEmail" type="email" placeholder="contato@ong.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ongPhone">Telefone *</Label>
                    <Input id="ongPhone" type="tel" placeholder="(11) 3456-7890" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (opcional)</Label>
                    <Input id="website" type="url" placeholder="https://www.ong.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Sobre a ONG *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Conte um pouco sobre a história e missão da ONG..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ongAddress">Endereço *</Label>
                    <Input id="ongAddress" placeholder="Rua, número, complemento" required />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ongCity">Cidade *</Label>
                      <Input id="ongCity" placeholder="São Paulo" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ongState">Estado *</Label>
                      <Input id="ongState" placeholder="SP" maxLength={2} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ongZipCode">CEP *</Label>
                      <Input id="ongZipCode" placeholder="00000-000" required />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="font-semibold mb-4">Responsável pela Conta</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="responsibleName">Nome Completo *</Label>
                          <Input id="responsibleName" placeholder="Maria Santos" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="responsibleRole">Cargo *</Label>
                          <Input id="responsibleRole" placeholder="Coordenadora" required />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="responsibleEmail">Email Pessoal *</Label>
                          <Input id="responsibleEmail" type="email" placeholder="maria@email.com" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="responsiblePhone">Telefone Pessoal *</Label>
                          <Input id="responsiblePhone" type="tel" placeholder="(11) 98765-4321" required />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="ongPassword">Senha *</Label>
                    <Input id="ongPassword" type="password" placeholder="••••••••" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ongConfirmPassword">Confirmar Senha *</Label>
                    <Input id="ongConfirmPassword" type="password" placeholder="••••••••" required />
                  </div>

                  <Separator />

                  <Button type="submit" className="w-full" size="lg" variant="secondary">
                    Criar Conta da ONG
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
