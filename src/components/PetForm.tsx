import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, X, Loader2, Image } from "lucide-react";
import { uploadService } from "@/lib/api";
import { toast } from "sonner";
import { User } from "@/lib/api";

type PetFormProps = {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
    userType?: 'ong' | 'admin' | 'adopter';
    ongs?: User[]; // Required if userType is 'admin'
    onCancel: () => void;
};

export const PetForm = ({ initialData, onSubmit, isLoading, userType = 'ong', ongs = [], onCancel }: PetFormProps) => {
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
        city: "",
        state: "",
        ong_id: "",
        status: "available",
        photos: [] as string[],
        ...initialData,
    });

    // Pre-populate specific fields if initialData is provided but might be using different property names (like personality -> temperament)
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                temperament: initialData.personality || initialData.temperament || prev.temperament,
                photos: initialData.additional_images || initialData.photos || prev.photos,
                age_years: initialData.age_years?.toString() || prev.age_years,
                age_months: initialData.age_months?.toString() || prev.age_months,
                ong_id: initialData.ong_id || prev.ong_id,
            }));
        }
    }, [initialData]);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (formData.photos.length + files.length > 5) {
            toast.error("Limite excedido: Você pode adicionar no máximo 5 fotos.");
            return;
        }

        setUploadingPhotos(true);

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                if (file.size > 5 * 1024 * 1024) throw new Error(`Arquivo ${file.name} é muito grande. Máximo: 5MB`);
                if (!file.type.startsWith('image/')) throw new Error(`Arquivo ${file.name} não é uma imagem válida`);
                return await uploadService.uploadPetImage(file);
            });

            const urls = await Promise.all(uploadPromises);
            setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...urls] }));
            toast.success(`${urls.length} foto(s) adicionada(s) com sucesso.`);
        } catch (error: any) {
            toast.error(error.message || "Erro no upload das imagens.");
        } finally {
            setUploadingPhotos(false);
            e.target.value = '';
        }
    };

    const removePhoto = (index: number) => {
        setFormData((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare data
        const submitData: any = {
            ...formData,
            age_years: formData.age_years ? parseInt(formData.age_years.toString()) : undefined,
            age_months: formData.age_months ? parseInt(formData.age_months.toString()) : undefined,
            photos: formData.photos.length > 0 ? formData.photos : undefined,
        };

        // Cleanup empty strings
        Object.keys(submitData).forEach(key => {
            if (submitData[key] === "") submitData[key] = undefined;
        });

        if (userType === 'admin' && !submitData.ong_id) {
            toast.error('Selecione uma ONG para vincular ao pet');
            return;
        }

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>

                {userType === 'admin' && (
                    <div className="space-y-2">
                        <Label>ONG Responsável *</Label>
                        <Select value={formData.ong_id || ""} onValueChange={v => handleInputChange("ong_id", v)}>
                            <SelectTrigger><SelectValue placeholder="Selecione uma ONG" /></SelectTrigger>
                            <SelectContent>
                                {ongs.map(ong => (
                                    <SelectItem key={ong.id} value={ong.id}>{ong.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {userType === 'admin' && (
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={v => handleInputChange("status", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="available">Disponível</SelectItem>
                                <SelectItem value="in_process">Em Processo</SelectItem>
                                <SelectItem value="adopted">Adotado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

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
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                            placeholder="Ex: Vira-lata, Labrador"
                            value={formData.breed || ""}
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
                                <Label htmlFor="male" className="cursor-pointer">Macho</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female" className="cursor-pointer">Fêmea</Label>
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
                            placeholder="0"
                            value={formData.age_years || ""}
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
                            value={formData.age_months || ""}
                            onChange={(e) => handleInputChange("age_months", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="size">Porte *</Label>
                        <Select
                            value={formData.size}
                            onValueChange={(value) => handleInputChange("size", value)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                        id="description"
                        placeholder="Conte um pouco sobre a personalidade, história e características do pet..."
                        rows={4}
                        value={formData.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="temperament">Temperamento</Label>
                    <Input
                        id="temperament"
                        placeholder="Ex: Brincalhão, Calmo, Sociável"
                        value={formData.temperament || ""}
                        onChange={(e) => handleInputChange("temperament", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="health_info">Informações de Saúde</Label>
                    <Textarea
                        id="health_info"
                        placeholder="Vacinação, castração, condições especiais..."
                        rows={3}
                        value={formData.health_info || ""}
                        onChange={(e) => handleInputChange("health_info", e.target.value)}
                    />
                </div>
            </div>

            {userType === 'ong' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Localização</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">Cidade *</Label>
                            <Input
                                id="city"
                                placeholder="São Paulo"
                                value={formData.city || ""}
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
                                value={formData.state || ""}
                                onChange={(e) => handleInputChange("state", e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Fotos */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fotos do Pet</h3>

                <div className="space-y-4">
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${uploadingPhotos || formData.photos.length >= 5
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:border-primary hover:bg-primary/5 cursor-pointer'
                        }`}>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            onChange={handleFileSelect}
                            disabled={uploadingPhotos || formData.photos.length >= 5}
                            className="hidden"
                        />
                        <Label htmlFor="photo-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                            {uploadingPhotos ? (
                                <>
                                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                    <span className="text-sm">Enviando fotos...</span>
                                </>
                            ) : (
                                <>
                                    <Image className="h-8 w-8 text-muted-foreground mb-2" />
                                    <div className="text-center">
                                        <p className="text-sm font-medium">Clique para selecionar fotos</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formData.photos.length}/5 fotos (Máx 5MB)
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
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                                        onClick={() => removePhoto(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    {index === 0 && (
                                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow">
                                            Principal
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                        </>
                    ) : "Salvar Pet"}
                </Button>
            </div>
        </form>
    );
};
