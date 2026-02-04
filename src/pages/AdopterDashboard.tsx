import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, User as UserIcon, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { applicationService, favoriteService, AdoptionApplication, Favorite } from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdopterDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsData, favsData] = await Promise.all([
          applicationService.getMyApplications(),
          favoriteService.getFavorites()
        ]);
        setApplications(appsData);
        setFavorites(favsData);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados do painel");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejeitado</Badge>;
      case 'cancelled': return <Badge variant="secondary">Cancelado</Badge>;
      default: return <Badge variant="secondary" className="bg-yellow-500 text-white">Em Análise</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Painel</h1>
          <p className="text-muted-foreground">Gerencie suas candidaturas e favoritos</p>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Candidaturas
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <UserIcon className="h-4 w-4" />
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <div className="grid gap-4">
              {applications.length === 0 && !loading && (
                <div className="text-center py-10 text-muted-foreground">
                  Você ainda não tem candidaturas.
                </div>
              )}
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <img
                        src={app.pet_image_url || "/placeholder-pet.jpg"}
                        alt={app.pet_name}
                        className="w-24 h-24 rounded-xl object-cover bg-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-xl">{app.pet_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {app.ong_name}
                            </p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Enviado em {formatDate(app.created_at)}
                        </p>
                        {/* TODO: Implement messaging */}
                        <Button size="sm" disabled>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.length === 0 && !loading && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  Você ainda não tem favoritos.
                </div>
              )}
              {favorites.map((fav) => (
                <Card key={fav.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={fav.pet?.image_url || "/placeholder-pet.jpg"}
                      alt={fav.pet?.name}
                      className="w-full h-full object-cover bg-gray-200"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">{fav.pet?.name}</h3>
                    <Button className="w-full" size="sm" asChild>
                      <Link to={`/pets/${fav.pet?.id}`}>Ver Detalhes</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Gerencie suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <p className="text-muted-foreground">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefone</label>
                    <p className="text-muted-foreground">{user?.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cidade/Estado</label>
                    <p className="text-muted-foreground">
                      {user?.city && user?.state ? `${user.city}/${user.state}` : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">CPF</label>
                    <p className="text-muted-foreground">{user?.cpf || '-'}</p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perfil (Em Breve)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdopterDashboard;
