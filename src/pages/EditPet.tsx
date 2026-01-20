import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Upload, PawPrint, X, Loader2, Image } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { petService, uploadService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const EditPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPet, setIsLoadingPet] = useState(true);
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
    photos: [] as string[],
  });

  useEffect(() => {
    loadPet();
  }, [id]);

  const loadPet = async () => {
    if (!id) return;

    try {
      setIsLoadingPet(true);
      const pet: any = await petService.getPetById(id);
      
      setFormData({
        name: pet.name || "",
        species: pet.species || "dog",
        breed: pet.breed || "",
        age_years: pet.age_years?.toString() || "",
        age_months: pet.age_months?.toString() || "",
        size: pet.size || "medium",
        gender: pet.gender || "male",
        description: pet.description || "",
        health_info: pet.health_info || "",
        temperament: pet.personality || pet.temperament || "",
        photos: pet.additional_images || pet.photos || [],
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar pet",
        description: error.message || "Não foi possível carregar os dados do pet.",
      });
      navigate("/ong-dashboard");
    } finally {
      setIsLoadingPet(false);
    }
  };

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
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Arquivo ${file.name} é muito grande. Máximo: 5MB`);
        }

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
        title: "Upload concluído!",
        description: `${urls.length} foto${urls.length > 1 ? 's' : ''} adicionada${urls.length > 1 ? 's' : ''} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error.message || "Não foi possível fazer o upload das imagens.",
      });
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado como ONG para editar pets.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados removendo campos vazios/undefined
      const petData: any = {
        name: formData.name,
        species: formData.species,
      };

      // Adicionar campos opcionais apenas se tiverem valor
      if (formData.breed?.trim()) petData.breed = formData.breed.trim();
      
      if (formData.age_years) {
        const years = parseInt(formData.age_years);
        if (!isNaN(years)) petData.age_years = years;
      }
      
      if (formData.age_months) {
        const months = parseInt(formData.age_months);
        if (!isNaN(months)) petData.age_months = months;
      }
      
      if (formData.size) petData.size = formData.size;
      if (formData.gender) petData.gender = formData.gender;
      if (formData.description?.trim()) petData.description = formData.description.trim();
      if (formData.health_info?.trim()) petData.health_info = formData.health_info.trim();
      if (formData.temperament?.trim()) petData.temperament = formData.temperament.trim();
      if (formData.photos.length > 0) petData.photos = formData.photos;

      console.log('Enviando petData para API:', petData);
      
      const updatedPet = await petService.updatePet(id, petData);
      
      console.log('Pet atualizado:', updatedPet);

      toast({
        title: "Pet atualizado com sucesso!",
        description: `${formData.name} foi atualizado.`,
      });

      navigate("/ong-dashboard");
    } catch (error: any) {
      console.error('Erro ao atualizar pet:', error);
      console.error('Resposta do servidor:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido";
      
      toast({
        variant: "destructive",
        title: "Erro ao atualizar pet",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPet) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="container py-8 max-w-3xl">
          <Skeleton className="h-10 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <CardTitle className="text-2xl">Editar Pet</CardTitle>
                <CardDescription>
                  Atualize as informações de {formData.name}
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
                    <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)}>
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
                    <Label htmlFor="breed">Raça</Label>
                    <Input
                      id="breed"
                      placeholder="Ex: Labrador, SRD"
                      value={formData.breed}
                      onChange={(e) => handleInputChange("breed", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Porte</Label>
                    <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
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

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age_years">Idade (Anos)</Label>
                    <Input
                      id="age_years"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.age_years}
                      onChange={(e) => handleInputChange("age_years", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age_months">Idade (Meses)</Label>
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
                    <Label>Sexo</Label>
                    <RadioGroup value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="cursor-pointer">Macho</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="cursor-pointer">Fêmea</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Descrição e Personalidade</h3>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Conte sobre o pet, sua história, características..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperament">Temperamento</Label>
                  <Input
                    id="temperament"
                    placeholder="Ex: Calmo, brincalhão, sociável"
                    value={formData.temperament}
                    onChange={(e) => handleInputChange("temperament", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="health_info">Informações de Saúde</Label>
                  <Textarea
                    id="health_info"
                    placeholder="Ex: Vacinado, castrado, vermifugado..."
                    rows={3}
                    value={formData.health_info}
                    onChange={(e) => handleInputChange("health_info", e.target.value)}
                  />
                </div>
              </div>

              {/* Fotos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Fotos do Pet</h3>
                  <span className="text-sm text-muted-foreground">
                    {formData.photos.length}/5 fotos
                  </span>
                </div>

                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="photo-upload"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploadingPhotos || formData.photos.length >= 5}
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${
                      uploadingPhotos || formData.photos.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingPhotos ? (
                      <>
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <p className="text-sm font-medium">Fazendo upload...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            Clique para selecionar ou arraste as imagens
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG ou WebP (máx. 5MB cada, até 5 fotos)
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                </div>

                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
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
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPet;
