import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, PawPrint, Users, BarChart, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { petService, applicationService, userService, type Pet, type AdoptionApplication } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ONGDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadPets();
    loadApplications();
    loadStatistics();
  }, []);

  const loadPets = async () => {
    try {
      setIsLoadingPets(true);
      const data = await petService.getMyPets();
      setPets(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar pets",
        description: error.message || "Não foi possível carregar os pets.",
      });
    } finally {
      setIsLoadingPets(false);
    }
  };

  const loadApplications = async () => {
    try {
      setIsLoadingApplications(true);
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar candidaturas",
        description: error.message || "Não foi possível carregar as candidaturas.",
      });
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const loadStatistics = async () => {
    try {
      setIsLoadingStats(true);
      if (user?.id) {
        const data = await userService.getONGStatistics(user.id);
        setStatistics(data);
      }
    } catch (error: any) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'in_process':
        return 'secondary';
      case 'adopted':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'in_process':
        return 'Em Processo';
      case 'adopted':
        return 'Adotado';
      default:
        return status;
    }
  };

  const getApplicationStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'under_review':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getApplicationStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'under_review':
        return 'Em Análise';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel da ONG</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {user?.name}
            </p>
          </div>
          <Button size="lg" onClick={() => navigate('/cadastrar-pet')}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Pet
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Pets</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {statistics?.total_pets || pets.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pets.filter(p => p.status === "available").length} disponíveis
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Candidaturas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {statistics?.total_applications || applications.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {applications.filter(a => a.status === "pending").length} pendentes
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Adoções Realizadas</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {statistics?.adopted_pets || pets.filter(p => p.status === "adopted").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total de adoções
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pets" className="gap-2">
              <PawPrint className="h-4 w-4" />
              Meus Pets
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <Users className="h-4 w-4" />
              Candidaturas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pets" className="space-y-4">
            {isLoadingPets ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : pets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <PawPrint className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum pet cadastrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece adicionando seu primeiro pet para adoção
                  </p>
                  <Button onClick={() => navigate('/cadastrar-pet')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Pet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative bg-muted">
                      {(pet.additional_images && pet.additional_images.length > 0) || pet.image_url ? (
                        <img
                          src={pet.additional_images?.[0] || pet.image_url}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${(pet.additional_images && pet.additional_images.length > 0) || pet.image_url ? 'hidden' : ''}`}>
                        <PawPrint className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <Badge 
                        className="absolute top-4 right-4"
                        variant={getStatusBadgeVariant(pet.status)}
                      >
                        {getStatusLabel(pet.status)}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">{pet.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        São Paulo, SP
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={() => navigate(`/editar-pet/${pet.id}`)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1" 
                          size="sm"
                          onClick={() => navigate(`/pet/${pet.id}`)}
                        >
                          Ver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {isLoadingApplications ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma candidatura</h3>
                  <p className="text-muted-foreground">
                    As candidaturas para seus pets aparecerão aqui
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map((app) => (
                  <Card key={app.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg">
                              Candidatura #{app.id.substring(0, 8)}
                            </h3>
                            <Badge variant={getApplicationStatusVariant(app.status)}>
                              {getApplicationStatusLabel(app.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(app.created_at)}
                            </div>
                          </div>
                          {app.has_experience && (
                            <p className="text-sm text-muted-foreground">
                              ✓ Tem experiência com pets
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/candidatura/${app.id}`)}
                          >
                            Analisar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ONGDashboard;
