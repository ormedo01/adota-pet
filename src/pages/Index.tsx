import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Search, MessageCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-pets.jpg";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";
import pet4 from "@/assets/pet-4.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        
        <div className="relative container py-20 md:py-32">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Encontre seu{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                melhor amigo
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Conectamos ONGs e adotantes em uma plataforma única e segura. 
              Milhares de pets esperando por um lar cheio de amor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/pets">Quero Adotar</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">Sou uma ONG</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Um processo simples e seguro para conectar você ao seu futuro pet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Busque</h3>
                <p className="text-sm text-muted-foreground">
                  Filtre por espécie, idade, porte e localização
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-bold text-lg">Escolha</h3>
                <p className="text-sm text-muted-foreground">
                  Conheça os pets disponíveis e suas histórias
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
                  <MessageCircle className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg">Conecte</h3>
                <p className="text-sm text-muted-foreground">
                  Converse diretamente com a ONG responsável
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Adote</h3>
                <p className="text-sm text-muted-foreground">
                  Complete o processo e leve seu novo amigo para casa
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pets em Destaque
            </h2>
            <p className="text-lg text-muted-foreground">
              Conheça alguns dos pets que estão esperando por você
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { image: pet1, name: "Max", age: "6 meses" },
              { image: pet2, name: "Luna", age: "3 meses" },
              { image: pet3, name: "Thor", age: "2 anos" },
              { image: pet4, name: "Mia", age: "1 ano" },
            ].map((pet, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-all">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{pet.name}</h3>
                  <p className="text-sm text-muted-foreground">{pet.age}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link to="/pets">Ver Todos os Pets</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-accent">
        <div className="container text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Adotar?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de famílias que já encontraram seus companheiros
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Começar Agora</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 AdotaPet. Feito com ❤️ para ajudar pets a encontrarem um lar.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
