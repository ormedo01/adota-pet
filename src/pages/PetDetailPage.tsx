import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Heart, MapPin, Calendar, Ruler, Activity, ArrowLeft, PawPrint } from "lucide-react";
import { petService } from "@/lib/api";

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pet, setPet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPet();
  }, [id]);

  const loadPet = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await petService.getPetById(id);
      setPet(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar pet",
        description: error.message || "Não foi possível carregar os dados do pet.",
      });
      navigate('/ong-dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getAgeText = () => {
    if (!pet) return "";
    const years = pet.age_years || 0;
    const months = pet.age_months || 0;
    
    if (years > 0 && months > 0) {
      return `${years} ano${years > 1 ? 's' : ''} e ${months} ${months > 1 ? 'meses' : 'mês'}`;
    } else if (years > 0) {
      return `${years} ano${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} ${months > 1 ? 'meses' : 'mês'}`;
    }
    return "Idade não informada";
  };

  const getSizeText = (size: string) => {
    const sizeMap: any = {
      small: "Pequeno",
      medium: "Médio",
      large: "Grande"
    };
    return sizeMap[size] || size;
  };

  const getSpeciesText = (species: string) => {
    const speciesMap: any = {
      dog: "Cachorro",
      cat: "Gato",
      other: "Outro"
    };
    return speciesMap[species] || species;
  };

  const getGenderText = (gender: string) => {
    const genderMap: any = {
      male: "Macho",
      female: "Fêmea"
    };
    return genderMap[gender] || gender;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="container py-8">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return null;
  }

  const mainImage = pet.additional_images?.[0] || pet.image_url;

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <div className="container py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            {mainImage ? (
              <img
                src={mainImage}
                alt={pet.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center ${mainImage ? 'hidden' : ''}`}>
              <PawPrint className="h-24 w-24 text-muted-foreground" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold">{pet.name}</h1>
                <Badge className="text-base">{getSpeciesText(pet.species)}</Badge>
              </div>
              <div className="flex items-center text-muted-foreground gap-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
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
                  <p className="font-semibold">{getAgeText()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Ruler className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Porte</p>
                  <p className="font-semibold">{getSizeText(pet.size)}</p>
                </div>
              </div>

              {pet.breed && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Raça</p>
                    <p className="font-semibold">{pet.breed}</p>
                  </div>
                </div>
              )}

              {pet.gender && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sexo</p>
                    <p className="font-semibold">{getGenderText(pet.gender)}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {pet.description && (
              <div>
                <h3 className="font-semibold mb-2">Sobre {pet.name}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pet.description}
                </p>
              </div>
            )}

            {pet.personality && (
              <div>
                <h3 className="font-semibold mb-3">Personalidade</h3>
                <p className="text-muted-foreground">{pet.personality}</p>
              </div>
            )}

            {pet.health_info && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-green-900">Saúde</h3>
                  <p className="text-green-800">{pet.health_info}</p>
                </CardContent>
              </Card>
            )}

            {pet.special_needs && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-amber-900">Necessidades Especiais</h3>
                  <p className="text-amber-800">{pet.special_needs}</p>
                </CardContent>
              </Card>
            )}

            {/* Gallery de fotos adicionais */}
            {pet.additional_images && pet.additional_images.length > 1 && (
              <div>
                <h3 className="font-semibold mb-3">Mais Fotos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {pet.additional_images.slice(1, 4).map((img: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={img}
                        alt={`${pet.name} - foto ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
