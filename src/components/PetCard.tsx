import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface PetCardProps {
  id: number;
  name: string;
  age: string;
  species: string;
  size: string;
  location: string;
  image: string;
}

export const PetCard = ({ id, name, age, species, size, location, image }: PetCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 rounded-full"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <Badge variant="secondary">{species}</Badge>
        </div>
        <div className="flex gap-2 mb-3">
          <Badge variant="outline">{age}</Badge>
          <Badge variant="outline">{size}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/pets/${id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
