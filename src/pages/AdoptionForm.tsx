import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Home, 
  Users, 
  DollarSign, 
  Clock,
  Heart,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import pet3 from "@/assets/pet-3.jpg";

const AdoptionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Mock data - in real app, fetch by ID
  const pet = {
    id: id,
    name: "Thor",
    age: "2 anos",
    species: "Cachorro",
    image: pet3,
    ong: "ONG Patinhas Felizes",
  };

  const [formData, setFormData] = useState({
    // Dados Pessoais
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    cpf: "",
    birthDate: "",
    
    // Endereço
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Moradia
    housingType: "house",
    housingOwnership: "own",
    hasYard: "",
    yardFenced: "",
    
    // Família
    householdSize: "",
    hasChildren: "",
    childrenAges: "",
    allAgree: false,
    
    // Experiência com Pets
    hasPets: "",
    petsDescription: "",
    hadPetsHistory: "",
    
    // Disponibilidade
    dailyHoursAlone: "",
    whoCaresWhenAway: "",
    financialReady: "",
    monthlyBudget: "",
    
    // Motivação
    adoptionReason: "",
    whatIfMoving: "",
    commitment: false,
    termsAccepted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.commitment || !formData.termsAccepted) {
      toast({
        variant: "destructive",
        title: "Atenção!",
        description: "Você precisa concordar com os termos para continuar.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulação de envio - aqui você faria a chamada à API
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Candidatura enviada com sucesso! 🎉",
        description: `Sua candidatura para adotar ${pet.name} foi enviada para ${pet.ong}. Você receberá um retorno em breve!`,
      });
      navigate(`/adopter-dashboard`);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="container py-16 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Login Necessário</CardTitle>
              <CardDescription>
                Você precisa estar logado para adotar um pet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link to="/login">Fazer Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/register">Criar Conta</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <div className="container py-8 max-w-5xl">
        <Link 
          to={`/pets/${id}`} 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para detalhes do pet
        </Link>

        {/* Pet Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">
                  Formulário de Adoção: {pet.name}
                </h2>
                <p className="text-muted-foreground">
                  {pet.species} • {pet.age} • {pet.ong}
                </p>
              </div>
              <Heart className="h-8 w-8 text-primary fill-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep >= step 
                    ? "bg-primary text-white" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs text-center text-muted-foreground">
            <div>Dados Pessoais</div>
            <div>Moradia</div>
            <div>Experiência</div>
            <div>Finalização</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Seus Dados Pessoais"}
                {currentStep === 2 && "Informações sobre sua Moradia"}
                {currentStep === 3 && "Experiência com Pets"}
                {currentStep === 4 && "Motivação e Compromisso"}
              </CardTitle>
              <CardDescription>
                Preencha as informações com atenção. Elas ajudarão a ONG a entender seu perfil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* STEP 1: Dados Pessoais */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
                    <Users className="h-5 w-5" />
                    Informações Básicas
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de Nascimento *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 98765-4321"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      required
                      className="md:w-1/2"
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
                    <Home className="h-5 w-5" />
                    Endereço
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo *</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, complemento"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado *</Label>
                      <Input
                        id="state"
                        placeholder="SP"
                        maxLength={2}
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP *</Label>
                      <Input
                        id="zipCode"
                        placeholder="00000-000"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Moradia */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Tipo de Moradia *</Label>
                    <RadioGroup 
                      value={formData.housingType}
                      onValueChange={(value) => setFormData({...formData, housingType: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="house" id="house" />
                        <Label htmlFor="house" className="font-normal cursor-pointer">Casa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="apartment" id="apartment" />
                        <Label htmlFor="apartment" className="font-normal cursor-pointer">Apartamento</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>A moradia é *</Label>
                    <RadioGroup 
                      value={formData.housingOwnership}
                      onValueChange={(value) => setFormData({...formData, housingOwnership: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="own" id="own" />
                        <Label htmlFor="own" className="font-normal cursor-pointer">Própria</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rented" id="rented" />
                        <Label htmlFor="rented" className="font-normal cursor-pointer">Alugada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="family" id="family" />
                        <Label htmlFor="family" className="font-normal cursor-pointer">De familiares</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Possui quintal ou área externa? *</Label>
                    <RadioGroup 
                      value={formData.hasYard}
                      onValueChange={(value) => setFormData({...formData, hasYard: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yard-yes" />
                        <Label htmlFor="yard-yes" className="font-normal cursor-pointer">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="yard-no" />
                        <Label htmlFor="yard-no" className="font-normal cursor-pointer">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.hasYard === "yes" && (
                    <div className="space-y-3">
                      <Label>O quintal é cercado/telado? *</Label>
                      <RadioGroup 
                        value={formData.yardFenced}
                        onValueChange={(value) => setFormData({...formData, yardFenced: value})}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="fenced-yes" />
                          <Label htmlFor="fenced-yes" className="font-normal cursor-pointer">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="fenced-no" />
                          <Label htmlFor="fenced-no" className="font-normal cursor-pointer">Não</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="partial" id="fenced-partial" />
                          <Label htmlFor="fenced-partial" className="font-normal cursor-pointer">Parcialmente</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="householdSize">Quantas pessoas moram na casa? *</Label>
                    <Input
                      id="householdSize"
                      type="number"
                      min="1"
                      value={formData.householdSize}
                      onChange={(e) => setFormData({...formData, householdSize: e.target.value})}
                      required
                      className="md:w-1/3"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Há crianças na casa? *</Label>
                    <RadioGroup 
                      value={formData.hasChildren}
                      onValueChange={(value) => setFormData({...formData, hasChildren: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="children-yes" />
                        <Label htmlFor="children-yes" className="font-normal cursor-pointer">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="children-no" />
                        <Label htmlFor="children-no" className="font-normal cursor-pointer">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.hasChildren === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="childrenAges">Quais as idades das crianças? *</Label>
                      <Input
                        id="childrenAges"
                        placeholder="Ex: 5 anos, 8 anos, 12 anos"
                        value={formData.childrenAges}
                        onChange={(e) => setFormData({...formData, childrenAges: e.target.value})}
                        required
                      />
                    </div>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="allAgree"
                      checked={formData.allAgree}
                      onCheckedChange={(checked) => setFormData({...formData, allAgree: checked as boolean})}
                    />
                    <Label htmlFor="allAgree" className="font-normal cursor-pointer leading-relaxed">
                      Todos os moradores da casa estão de acordo com a adoção? *
                    </Label>
                  </div>
                </div>
              )}

              {/* STEP 3: Experiência */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Você possui outros pets atualmente? *</Label>
                    <RadioGroup 
                      value={formData.hasPets}
                      onValueChange={(value) => setFormData({...formData, hasPets: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pets-yes" />
                        <Label htmlFor="pets-yes" className="font-normal cursor-pointer">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pets-no" />
                        <Label htmlFor="pets-no" className="font-normal cursor-pointer">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.hasPets === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="petsDescription">Descreva seus pets atuais *</Label>
                      <Textarea
                        id="petsDescription"
                        placeholder="Espécie, idade, temperamento..."
                        rows={3}
                        value={formData.petsDescription}
                        onChange={(e) => setFormData({...formData, petsDescription: e.target.value})}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="hadPetsHistory">Você já teve pets antes? Conte sua experiência. *</Label>
                    <Textarea
                      id="hadPetsHistory"
                      placeholder="Compartilhe sua experiência com animais..."
                      rows={4}
                      value={formData.hadPetsHistory}
                      onChange={(e) => setFormData({...formData, hadPetsHistory: e.target.value})}
                      required
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
                    <Clock className="h-5 w-5" />
                    Disponibilidade e Cuidados
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyHoursAlone">Quantas horas por dia o pet ficará sozinho? *</Label>
                    <Input
                      id="dailyHoursAlone"
                      placeholder="Ex: 4 horas"
                      value={formData.dailyHoursAlone}
                      onChange={(e) => setFormData({...formData, dailyHoursAlone: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whoCaresWhenAway">Quem cuidará do pet quando você viajar? *</Label>
                    <Textarea
                      id="whoCaresWhenAway"
                      placeholder="Familiares, amigos, hotel para pets..."
                      rows={2}
                      value={formData.whoCaresWhenAway}
                      onChange={(e) => setFormData({...formData, whoCaresWhenAway: e.target.value})}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4 mt-6">
                    <DollarSign className="h-5 w-5" />
                    Condições Financeiras
                  </div>

                  <div className="space-y-3">
                    <Label>Você está preparado financeiramente para arcar com os custos? *</Label>
                    <p className="text-sm text-muted-foreground">
                      (Alimentação, vacinas, veterinário, emergências)
                    </p>
                    <RadioGroup 
                      value={formData.financialReady}
                      onValueChange={(value) => setFormData({...formData, financialReady: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="financial-yes" />
                        <Label htmlFor="financial-yes" className="font-normal cursor-pointer">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partially" id="financial-partial" />
                        <Label htmlFor="financial-partial" className="font-normal cursor-pointer">Parcialmente</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyBudget">Qual seu orçamento mensal estimado para o pet? *</Label>
                    <Input
                      id="monthlyBudget"
                      placeholder="Ex: R$ 300,00"
                      value={formData.monthlyBudget}
                      onChange={(e) => setFormData({...formData, monthlyBudget: e.target.value})}
                      required
                      className="md:w-1/2"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Finalização */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="adoptionReason">Por que você deseja adotar {pet.name}? *</Label>
                    <Textarea
                      id="adoptionReason"
                      placeholder="Conte-nos suas motivações para essa adoção..."
                      rows={4}
                      value={formData.adoptionReason}
                      onChange={(e) => setFormData({...formData, adoptionReason: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatIfMoving">O que você faria com o pet se precisasse se mudar? *</Label>
                    <Textarea
                      id="whatIfMoving"
                      placeholder="Sua resposta..."
                      rows={3}
                      value={formData.whatIfMoving}
                      onChange={(e) => setFormData({...formData, whatIfMoving: e.target.value})}
                      required
                    />
                  </div>

                  <Separator />

                  <div className="bg-primary/5 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Termos de Compromisso
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="commitment"
                          checked={formData.commitment}
                          onCheckedChange={(checked) => setFormData({...formData, commitment: checked as boolean})}
                        />
                        <Label htmlFor="commitment" className="font-normal cursor-pointer leading-relaxed">
                          Declaro que estou ciente de que a adoção é um compromisso de longo prazo 
                          e que me responsabilizo pelo bem-estar do animal por toda sua vida.
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="termsAccepted"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => setFormData({...formData, termsAccepted: checked as boolean})}
                        />
                        <Label htmlFor="termsAccepted" className="font-normal cursor-pointer leading-relaxed">
                          Concordo que a ONG pode realizar visitas de acompanhamento e que forneci 
                          informações verdadeiras neste formulário.
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium mb-1">Próximos passos:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Sua candidatura será analisada pela {pet.ong}</li>
                            <li>Você receberá um retorno em até 7 dias úteis</li>
                            <li>Pode ser solicitada uma entrevista e/ou visita</li>
                            <li>Acompanhe o status no seu dashboard</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Etapa {currentStep} de 4
            </div>

            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>
                Próximo
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.commitment || !formData.termsAccepted}
                className="min-w-[140px]"
              >
                {isSubmitting ? "Enviando..." : "Enviar Candidatura"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm;
