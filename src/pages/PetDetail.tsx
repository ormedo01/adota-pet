import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Calendar, Ruler, Shield } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import pet3 from "@/assets/pet-3.jpg";

const PetDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch by ID
  const pet = {
    id: id,
    name: "Thor",
    age: "2 anos",
    species: "Cachorro",
    breed: "Vira-lata",
    size: "Grande",
    weight: "25kg",
    location: "Belo Horizonte, MG",
    ong: "ONG Patinhas Felizes",
    description: "Thor é um cachorro super carinhoso e brincalhão. Adora crianças e se dá bem com outros animais. Foi resgatado das ruas e está procurando uma família que possa dar todo amor que ele merece.",
    personality: ["Brincalhão", "Sociável", "Obediente", "Energético"],
    health: "Vacinado, castrado e vermifugado",
    image: pet3,
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <div className="container py-8">
        <Link to="/pets" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Voltar para pets
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 rounded-full"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold">{pet.name}</h1>
                <Badge className="text-base">{pet.species}</Badge>
              </div>
              <div className="flex items-center text-muted-foreground gap-2">
                <MapPin className="h-4 w-4" />
                <span>{pet.location}</span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idade</p>
                  <p className="font-semibold">{pet.age}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Ruler className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Porte</p>
                  <p className="font-semibold">{pet.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Ruler className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="font-semibold">{pet.weight}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Raça</p>
                  <p className="font-semibold">{pet.breed}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-bold text-lg mb-2">Sobre {pet.name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {pet.description}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Personalidade</h3>
              <div className="flex flex-wrap gap-2">
                {pet.personality.map((trait, index) => (
                  <Badge key={index} variant="secondary">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">Saúde:</span>
                  <span className="text-muted-foreground">{pet.health}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full" asChild>
                <Link to={`/pets/${id}/adopt`}>
                  Quero Adotar {pet.name}
                </Link>
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Responsável: {pet.ong}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
