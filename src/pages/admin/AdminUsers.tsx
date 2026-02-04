import { useEffect, useState } from "react";
import { adminService, type User, type RegisterDto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Search } from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState<Partial<RegisterDto>>({
        user_type: "adopter",
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    };

    const [editingId, setEditingId] = useState<string | null>(null);

    // ... (keep useEffect)

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setEditingId(user.id);
            setNewUser({
                name: user.name,
                email: user.email,
                user_type: user.user_type,
                cpf: user.cpf,
                cnpj: user.cnpj,
                phone: user.phone,
                city: user.city,
                state: user.state,
            });
        } else {
            setEditingId(null);
            setNewUser({ user_type: "adopter" });
        }
        setIsDialogOpen(true);
    };

    const handleSaveUser = async () => {
        try {
            if (!newUser.name || !newUser.user_type) {
                toast.error("Preencha os campos obrigatórios");
                return;
            }
            // For create, email and password are required
            if (!editingId && (!newUser.email || !newUser.password)) {
                toast.error("Email e senha são obrigatórios para novo usuário");
                return;
            }

            if (editingId) {
                await adminService.updateUser(editingId, newUser);
                toast.success("Usuário atualizado com sucesso!");
            } else {
                await adminService.createUser(newUser as RegisterDto);
                toast.success("Usuário criado com sucesso!");
            }

            setIsDialogOpen(false);
            setNewUser({ user_type: "adopter" });
            setEditingId(null);
            loadUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao salvar usuário");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este usuário?")) return;
        try {
            await adminService.deleteUser(id);
            toast.success("Usuário removido");
            loadUsers();
        } catch (error) {
            toast.error("Erro ao remover usuário");
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
                    <p className="text-muted-foreground">Listagem e cadastro de usuários</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()}><Plus className="mr-2 h-4 w-4" /> Novo Usuário</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Editar Usuário' : 'Criar Novo Usuário'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nome Completo *</Label>
                                <Input
                                    value={newUser.name || ""}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email *</Label>
                                <Input
                                    type="email"
                                    value={newUser.email || ""}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    disabled={!!editingId} // Prevent email change for now to avoid complexity
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{editingId ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}</Label>
                                <Input
                                    type="password"
                                    value={newUser.password || ""}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Telefone</Label>
                                    <Input
                                        value={newUser.phone || ""}
                                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipo de Usuário</Label>
                                    <Select
                                        value={newUser.user_type}
                                        onValueChange={(value: any) => setNewUser({ ...newUser, user_type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="adopter">Adotante</SelectItem>
                                            <SelectItem value="ong">ONG</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Cidade</Label>
                                    <Input
                                        value={newUser.city || ""}
                                        onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Estado</Label>
                                    <Input
                                        value={newUser.state || ""}
                                        maxLength={2}
                                        onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Dynamic Fields */}
                            {newUser.user_type === "ong" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                    <Label>CNPJ</Label>
                                    <Input
                                        value={newUser.cnpj || ""}
                                        placeholder="00.000.000/0000-00"
                                        onChange={(e) => setNewUser({ ...newUser, cnpj: e.target.value })}
                                    />
                                </div>
                            )}
                            {newUser.user_type === "adopter" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                    <Label>CPF</Label>
                                    <Input
                                        value={newUser.cpf || ""}
                                        placeholder="000.000.000-00"
                                        onChange={(e) => setNewUser({ ...newUser, cpf: e.target.value })}
                                    />
                                </div>
                            )}

                            <Button onClick={handleSaveUser} className="w-full">
                                {editingId ? 'Salvar Alterações' : 'Criar Usuário'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Cidade/UF</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Carregando...</TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Nenhum usuário encontrado</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.user_type === 'admin' ? 'bg-red-100 text-red-800' :
                                            user.user_type === 'ong' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {user.user_type === 'ong' ? 'ONG' : user.user_type === 'admin' ? 'ADMIN' : 'ADOTANTE'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{user.city ? `${user.city}/${user.state}` : '-'}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(user)}>
                                            Editar
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
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
