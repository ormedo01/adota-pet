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
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";
import pet4 from "@/assets/pet-4.jpg";
import pet5 from "@/assets/pet-5.jpg";
import pet6 from "@/assets/pet-6.jpg";

const mockPets = [
  { id: 1, name: "Max", age: "6 meses", species: "Cachorro", size: "Pequeno", location: "São Paulo, SP", image: pet1 },
  { id: 2, name: "Luna", age: "3 meses", species: "Gato", size: "Pequeno", location: "Rio de Janeiro, RJ", image: pet2 },
  { id: 3, name: "Thor", age: "2 anos", species: "Cachorro", size: "Grande", location: "Belo Horizonte, MG", image: pet3 },
  { id: 4, name: "Mia", age: "1 ano", species: "Gato", size: "Médio", location: "Curitiba, PR", image: pet4 },
  { id: 5, name: "Rex", age: "4 anos", species: "Cachorro", size: "Grande", location: "Porto Alegre, RS", image: pet5 },
  { id: 6, name: "Mel", age: "5 meses", species: "Gato", size: "Pequeno", location: "Salvador, BA", image: pet6 },
];

const Pets = () => {
  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Encontre seu Novo Amigo</h1>
          <p className="text-muted-foreground">
            {mockPets.length} pets esperando por um lar
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Espécie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="dog">Cachorro</SelectItem>
                <SelectItem value="cat">Gato</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Porte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="small">Pequeno</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Idade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="puppy">Filhote</SelectItem>
                <SelectItem value="adult">Adulto</SelectItem>
                <SelectItem value="senior">Sênior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pet Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPets.map((pet) => (
            <PetCard key={pet.id} {...pet} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pets;
