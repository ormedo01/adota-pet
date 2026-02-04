import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { petService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { PetForm } from "@/components/PetForm";

const CreatePet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado como ONG para cadastrar pets.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const petData = {
        ...formData,
        // Ensure city/state from user if not provided (though form manages it now, we can fallback or override)
        city: formData.city || user.city,
        state: formData.state || user.state,
      };

      await petService.createPet(petData);

      toast({
        title: "Pet cadastrado com sucesso!",
        description: `${formData.name} foi adicionado aos pets disponíveis para adoção.`,
      });

      navigate("/ong-dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar pet",
        description: error.message || "Não foi possível cadastrar o pet. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />

      <div className="container py-8 max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/ong-dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <PawPrint className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Cadastrar Novo Pet</CardTitle>
                <CardDescription>
                  Preencha as informações do pet para adoção
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <PetForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              userType="ong"
              onCancel={() => navigate("/ong-dashboard")}
              initialData={{ city: user?.city, state: user?.state }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePet;
