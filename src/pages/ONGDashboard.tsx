import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, PawPrint, Users, BarChart } from "lucide-react";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";

const ONGDashboard = () => {
  const pets = [
    { id: 1, name: "Max", status: "Disponível", applications: 3, image: pet1 },
    { id: 2, name: "Luna", status: "Disponível", applications: 5, image: pet2 },
    { id: 3, name: "Thor", status: "Em Processo", applications: 2, image: pet3 },
  ];

  const applications = [
    { id: 1, adopter: "Maria Santos", pet: "Max", date: "10/01/2025", status: "Pendente" },
    { id: 2, adopter: "João Silva", pet: "Thor", date: "09/01/2025", status: "Aprovado" },
    { id: 3, adopter: "Ana Costa", pet: "Luna", date: "08/01/2025", status: "Pendente" },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel da ONG</h1>
            <p className="text-muted-foreground">Gerencie seus pets e candidaturas</p>
          </div>
          <Button size="lg">
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
              <div className="text-2xl font-bold">{pets.length}</div>
              <p className="text-xs text-muted-foreground">
                {pets.filter(p => p.status === "Disponível").length} disponíveis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Candidaturas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">
                {applications.filter(a => a.status === "Pendente").length} pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Adoção</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">
                +12% este mês
              </p>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4">
                      {pet.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pet.applications} candidaturas
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">Editar</Button>
                      <Button variant="outline" className="flex-1" size="sm">
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <div className="grid gap-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{app.adopter}</h3>
                          <Badge variant={app.status === "Aprovado" ? "default" : "secondary"}>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Pet: {app.pet} • {app.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Analisar</Button>
                        <Button variant="outline" size="sm">Contatar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ONGDashboard;
