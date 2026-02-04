import { useEffect, useState } from "react";
import { adminService, userService, type Pet, type User } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, Search, ExternalLink, Upload, Loader2, X } from "lucide-react";
import { uploadService } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { PetForm } from "@/components/PetForm";


export default function AdminPets() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [petData, setPetData] = useState<Partial<Pet>>({
        species: "dog",
        size: "medium",
        gender: "male",
        status: "available"
    });

    const [pets, setPets] = useState<Pet[]>([]);
    const [ongs, setOngs] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        try {
            const [petsData, ongsData] = await Promise.all([
                adminService.getAllPets(),
                userService.getONGs()
            ]);
            setPets(petsData);
            setOngs(ongsData);
        } catch (error) {
            toast.error("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (pet?: Pet) => {
        setIsUploading(false);
        if (pet) {
            setEditingId(pet.id);
            setPetData({
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                size: pet.size,
                gender: pet.gender,
                status: pet.status,
                description: pet.description,
                image_url: pet.image_url,
                ong_id: pet.ong_id
            });
        } else {
            setEditingId(null);
            setPetData({
                species: "dog",
                size: "medium",
                gender: "male",
                status: "available",
                image_url: "",
                ong_id: ""
            });
        }
        setIsDialogOpen(true);
    };

    const handleSavePet = async (formData?: any) => {
        const dataToSave = formData || petData;

        debugger;

        try {
            if (!dataToSave.name || !dataToSave.species || !dataToSave.size || !dataToSave.gender || !dataToSave.ong_id) {
                toast.error("Preencha os campos obrigatórios (incluindo ONG)");
                return;
            }

            if (editingId) {
                await adminService.updatePet(editingId, dataToSave);
                toast.success("Pet atualizado");
            } else {
                await adminService.createPet(dataToSave);
                toast.success("Pet criado");
            }

            setIsDialogOpen(false);
            setEditingId(null);
            loadPets();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao salvar pet");
        }
    };

    const handleDeletePet = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este pet?")) return;
        try {
            await adminService.deletePet(id);
            toast.success("Pet removido");
            loadPets();
        } catch (error) {
            toast.error("Erro ao remover pet");
        }
    };

    const filteredPets = pets.filter((pet) =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pet.ong_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Gerenciar Pets</h1>
                    <p className="text-muted-foreground">Listagem de todos os animais cadastrados</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()}><ExternalLink className="mr-2 h-4 w-4" /> Novo Pet</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Editar Pet" : "Novo Pet"}</DialogTitle>
                        </DialogHeader>
                        <PetForm
                            initialData={petData}
                            onSubmit={async (data) => {
                                setPetData(data); // Update local state for immediate re-renders if needed, though handleSavePet does the logic
                                await handleSavePet(data);
                            }}
                            isLoading={isUploading}
                            userType="admin"
                            ongs={ongs}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar pet ou ONG..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Foto</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Espécie</TableHead>
                            <TableHead>ONG Responsável</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                            </TableRow>
                        ) : filteredPets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Nenhum pet encontrado</TableCell>
                            </TableRow>
                        ) : (
                            filteredPets.map((pet) => (
                                <TableRow key={pet.id}>
                                    <TableCell>
                                        {pet.image_url ? (
                                            <img src={pet.image_url} alt={pet.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{pet.name}</TableCell>
                                    <TableCell>{pet.species === 'dog' ? 'Cachorro' : pet.species === 'cat' ? 'Gato' : 'Outro'}</TableCell>
                                    <TableCell>{pet.ong_name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${pet.status === 'adopted' ? 'bg-green-100 text-green-800' :
                                            pet.status === 'in_process' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {pet.status === 'adopted' ? 'Adotado' :
                                                pet.status === 'in_process' ? 'Em Processo' :
                                                    'Disponível'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(pet)}>
                                            Editar
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeletePet(pet.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
