import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Calendar, Ruler, Shield, Weight } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { petService, type Pet } from "@/lib/api";
import { toast } from "sonner";

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPet = async () => {
      if (!id) return;
      try {
        const data = await petService.getPetById(id);
        setPet(data);
      } catch (error) {
        toast.error("Erro ao carregar detalhes do pet");
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="container py-8 flex justify-center items-center h-[50vh]">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="container py-8 flex justify-center items-center h-[50vh]">
          <p>Pet não encontrado</p>
        </div>
      </div>
    );
  }

  // Helpers for display
  const displayAge = () => {
    const years = pet.age_years;
    const months = pet.age_months;
    if (years && years > 0) return `${years} ano${years > 1 ? 's' : ''}`;
    if (months && months > 0) return `${months} mes${months > 1 ? 'es' : ''}`;
    return "Idade não informada";
  };

  const displayImage = pet.image_url || (pet.photos && pet.photos.length > 0 ? pet.photos[0] : "https://placehold.co/600x400?text=Sem+Foto");

  // Parse personality if it's a string, assuming comma separated or just singular
  // The API interface says string, mock had array. We'll handle string split if needed or just array of one.
  const personalityTraits = pet.temperament ? pet.temperament.split(',').map(t => t.trim()) : [];
  if (pet.personality && personalityTraits.length === 0) {
    // Fallback if personality field is used instead of temperament
    const p = pet.personality.split(',').map(t => t.trim());
    personalityTraits.push(...p);
  }


  return (
    <div className="min-h-screen bg-muted/20">
      <Header />

      <div className="container py-8">
        <Link to="/pets" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Voltar para pets
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <img
              src={displayImage}
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
                <Badge className="text-base">
                  {pet.species === 'dog' ? 'Cachorro' : pet.species === 'cat' ? 'Gato' : 'Outro'}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground gap-2">
                <MapPin className="h-4 w-4" />
                <span>{pet.city}, {pet.state}</span>
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
                  <p className="font-semibold">{displayAge()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Ruler className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Porte</p>
                  <p className="font-semibold">
                    {pet.size === 'small' ? 'Pequeno' : pet.size === 'medium' ? 'Médio' : 'Grande'}
                  </p>
                </div>
              </div>

              {/* Weight is not in API, removing or keeping static placeholder if desired. 
                  Since user asked for dynamic info, better to hide or show generic if unknown */}
              {/* 
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Weight className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="font-semibold">{pet.weight || 'N/A'}</p>
                </div>
              </div> 
              */}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Raça</p>
                  <p className="font-semibold">{pet.breed || 'Não informada'}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-bold text-lg mb-2">Sobre {pet.name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {pet.description || "Sem descrição disponível."}
              </p>
            </div>

            {personalityTraits.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3">Personalidade</h3>
                <div className="flex flex-wrap gap-2">
                  {personalityTraits.map((trait, index) => (
                    <Badge key={index} variant="secondary">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(pet.health_info) && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-medium">Saúde:</span>
                    <span className="text-muted-foreground">{pet.health_info}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full" asChild disabled={pet.status !== 'available'}>
                <Link to={`/pets/${id}/adopt`}>
                  {pet.status === 'available' ? `Quero Adotar ${pet.name}` : 'Indisponível para adoção'}
                </Link>
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Responsável: {pet.ong_name || "ONG"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
