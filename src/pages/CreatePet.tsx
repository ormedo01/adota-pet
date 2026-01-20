import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload, PawPrint, X, Loader2, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { petService, uploadService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const CreatePet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    species: "dog" as "dog" | "cat" | "other",
    breed: "",
    age_years: "",
    age_months: "",
    size: "medium" as "small" | "medium" | "large",
    gender: "male" as "male" | "female",
    description: "",
    health_info: "",
    temperament: "",
    city: user?.city || "",
    state: user?.state || "",
    photos: [] as string[],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.photos.length + files.length > 5) {
      toast({
        variant: "destructive",
        title: "Limite excedido",
        description: "Você pode adicionar no máximo 5 fotos.",
      });
      return;
    }

    setUploadingPhotos(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validar tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Arquivo ${file.name} é muito grande. Máximo: 5MB`);
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
          throw new Error(`Arquivo ${file.name} não é uma imagem válida`);
        }

        const url = await uploadService.uploadPetImage(file);
        return url;
      });

      const urls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...urls],
      }));

      toast({
        title: "Fotos enviadas!",
        description: `${urls.length} foto(s) adicionada(s) com sucesso.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar fotos",
        description: error.message || "Não foi possível fazer upload das fotos.",
      });
    } finally {
      setUploadingPhotos(false);
      // Limpar o input
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        name: formData.name,
        species: formData.species,
        breed: formData.breed || undefined,
        age_years: formData.age_years ? parseInt(formData.age_years) : undefined,
        age_months: formData.age_months ? parseInt(formData.age_months) : undefined,
        size: formData.size,
        gender: formData.gender,
        description: formData.description || undefined,
        health_info: formData.health_info || undefined,
        temperament: formData.temperament || undefined,
        city: formData.city,
        state: formData.state,
        photos: formData.photos.length > 0 ? formData.photos : undefined,
        status: "available" as const,
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Pet *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Thor"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="species">Espécie *</Label>
                    <Select
                      value={formData.species}
                      onValueChange={(value) => handleInputChange("species", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Cachorro</SelectItem>
                        <SelectItem value="cat">Gato</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breed">Raça (opcional)</Label>
                    <Input
                      id="breed"
                      placeholder="Ex: Vira-lata, Labrador"
                      value={formData.breed}
                      onChange={(e) => handleInputChange("breed", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gênero *</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange("gender", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">
                          Macho
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">
                          Fêmea
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age_years">Idade - Anos</Label>
                    <Input
                      id="age_years"
                      type="number"
                      min="0"
                      max="30"
                      placeholder="0"
                      value={formData.age_years}
                      onChange={(e) => handleInputChange("age_years", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age_months">Idade - Meses</Label>
                    <Input
                      id="age_months"
                      type="number"
                      min="0"
                      max="11"
                      placeholder="0"
                      value={formData.age_months}
                      onChange={(e) => handleInputChange("age_months", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Porte *</Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value) => handleInputChange("size", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeno</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Descrição e Características */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Descrição e Características</h3>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Pet</Label>
                  <Textarea
                    id="description"
                    placeholder="Conte um pouco sobre a personalidade, história e características do pet..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperament">Temperamento</Label>
                  <Input
                    id="temperament"
                    placeholder="Ex: Brincalhão, Calmo, Sociável"
                    value={formData.temperament}
                    onChange={(e) => handleInputChange("temperament", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="health_info">Informações de Saúde</Label>
                  <Textarea
                    id="health_info"
                    placeholder="Vacinação, castração, condições especiais..."
                    rows={3}
                    value={formData.health_info}
                    onChange={(e) => handleInputChange("health_info", e.target.value)}
                  />
                </div>
              </div>

              {/* Localização */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Localização</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      placeholder="SP"
                      maxLength={2}
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Fotos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fotos do Pet</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione até 5 fotos (JPG, PNG ou WebP, máximo 5MB cada)
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={handleFileSelect}
                      disabled={uploadingPhotos || formData.photos.length >= 5}
                      className="hidden"
                    />
                    <Label
                      htmlFor="photo-upload"
                      className={`flex-1 flex items-center justify-center gap-2 h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        uploadingPhotos || formData.photos.length >= 5
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      {uploadingPhotos ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span className="text-sm">Enviando fotos...</span>
                        </>
                      ) : (
                        <>
                          <Image className="h-6 w-6 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              Clique para selecionar fotos
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formData.photos.length}/5 fotos
                            </p>
                          </div>
                        </>
                      )}
                    </Label>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Erro+ao+carregar';
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                            onClick={() => handleRemovePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            Foto {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/ong-dashboard")}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar Pet"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePet;
