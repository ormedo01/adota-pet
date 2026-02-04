import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { PetCard } from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { petService, type Pet } from "@/lib/api";
import { toast } from "sonner";

const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: "all",
    size: "all",
    search: "",
  });

  useEffect(() => {
    fetchPets();
  }, [filters]); // Re-fetch when filters change (debouncing would be better for search)

  const fetchPets = async () => {
    setLoading(true);
    try {
      const apiFilters: any = {};
      if (filters.species && filters.species !== 'all') apiFilters.species = filters.species;
      if (filters.size && filters.size !== 'all') apiFilters.size = filters.size;
      if (filters.search) apiFilters.search = filters.search;

      const data = await petService.getPets(apiFilters);
      setPets(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar pets");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic debounce could be added here
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const mapPetToCard = (pet: Pet) => {
    // Format age
    let age = "N/A";
    if (pet.age_years) {
      age = `${pet.age_years} ano${pet.age_years > 1 ? 's' : ''}`;
      if (pet.age_months) age += ` e ${pet.age_months} mês(es)`;
    } else if (pet.age_months) {
      age = `${pet.age_months} mês(es)`;
    }

    // Format location
    const location = pet.city && pet.state ? `${pet.city}, ${pet.state}` : "Localização não informada";

    // Translate species/size for display
    const speciesMap: any = { dog: 'Cachorro', cat: 'Gato', other: 'Outro' };
    const sizeMap: any = { small: 'Pequeno', medium: 'Médio', large: 'Grande' };

    return {
      id: pet.id,
      name: pet.name,
      age,
      species: speciesMap[pet.species] || pet.species,
      size: sizeMap[pet.size] || pet.size,
      location,
      image: pet.image_url || "/placeholder.svg" // Ensure placeholder exists or handle broken image
    };
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Encontre seu Novo Amigo</h1>
          <p className="text-muted-foreground">
            {pets.length} pets esperando por um lar
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  className="pl-9"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <Select
              value={filters.species}
              onValueChange={(value) => setFilters(prev => ({ ...prev, species: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Espécie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Espécies</SelectItem>
                <SelectItem value="dog">Cachorro</SelectItem>
                <SelectItem value="cat">Gato</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.size}
              onValueChange={(value) => setFilters(prev => ({ ...prev, size: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Porte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Portes</SelectItem>
                <SelectItem value="small">Pequeno</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
            {/* Age filter removed as it is not supported in API yet */}
          </div>
        </div>

        {/* Pet Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              Carregando pets...
            </div>
          ) : pets.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              Nenhum pet encontrado com os filtros selecionados.
            </div>
          ) : (
            pets.map((pet) => (
              <PetCard key={pet.id} {...mapPetToCard(pet)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Pets;
