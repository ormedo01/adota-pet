import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, User, Settings } from "lucide-react";
import pet1 from "@/assets/pet-1.jpg";
import pet3 from "@/assets/pet-3.jpg";

const AdopterDashboard = () => {
  const applications = [
    { id: 1, pet: "Thor", status: "Em Análise", image: pet3, ong: "Patinhas Felizes", date: "10/01/2025" },
    { id: 2, pet: "Max", status: "Aprovado", image: pet1, ong: "Amigos dos Animais", date: "05/01/2025" },
  ];

  const favorites = [
    { id: 1, name: "Max", image: pet1 },
    { id: 3, name: "Thor", image: pet3 },
  ];

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
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <div className="grid gap-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <img
                        src={app.image}
                        alt={app.pet}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-xl">{app.pet}</h3>
                            <p className="text-sm text-muted-foreground">
                              {app.ong}
                            </p>
                          </div>
                          <Badge
                            variant={app.status === "Aprovado" ? "default" : "secondary"}
                          >
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Enviado em {app.date}
                        </p>
                        <Button size="sm">
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
              {favorites.map((fav) => (
                <Card key={fav.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={fav.image}
                      alt={fav.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">{fav.name}</h3>
                    <Button className="w-full" size="sm">
                      Ver Detalhes
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
                    <p className="text-muted-foreground">João Silva</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">joao@email.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefone</label>
                    <p className="text-muted-foreground">(11) 98765-4321</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cidade</label>
                    <p className="text-muted-foreground">São Paulo, SP</p>
                  </div>
                </div>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perfil
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
