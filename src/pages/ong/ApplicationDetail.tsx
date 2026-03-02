import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationService, type AdoptionApplication } from "@/lib/api";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    User,
    Phone,
    Mail,
    Home,
    Dog,
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    FileText
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [application, setApplication] = useState<AdoptionApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const loadApplication = async () => {
            if (!id) return;
            try {
                const data = await applicationService.getApplicationById(id);
                setApplication(data);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar candidatura",
                    description: "Não foi possível carregar os detalhes da candidatura.",
                });
                navigate("/ong-dashboard");
            } finally {
                setLoading(false);
            }
        };
        loadApplication();
    }, [id, navigate, toast]);

    const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
        if (!id || !application) return;

        setUpdating(true);
        try {
            await applicationService.updateApplicationStatus(id, status);
            setApplication({ ...application, status });
            toast({
                title: "Status atualizado",
                description: `Candidatura ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`,
            });
            navigate("/ong-dashboard");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar",
                description: "Não foi possível atualizar o status da candidatura.",
            });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-muted/20">
                <Header />
                <div className="container py-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!application) return null;

    const app = application as any;

    // Map backend snake_case fields to frontend camelCase used in this component
    const additionalInfo = {
        fullName: app.full_name || app.fullName,
        birthDate: app.birth_date || app.birthDate,
        cpf: app.cpf,
        email: app.email,
        phone: app.phone,
        address: app.address,
        city: app.city,
        state: app.state,
        zipCode: app.zip_code || app.zipCode,

        housingType: app.housing_type || app.housingType,
        housingOwnership: app.housing_ownership || app.housingOwnership,

        householdSize: app.household_size,
        hasChildren: app.has_children ? 'yes' : 'no',
        childrenAges: app.children_ages,

        dailyHoursAlone: app.daily_hours_alone || app.dailyHoursAlone,
        whoCaresWhenAway: app.who_cares_when_away || app.whoCaresWhenAway,

        financialReady: app.financial_readiness || app.financialReady,
        monthlyBudget: app.monthly_budget || app.monthlyBudget,

        adoptionReason: app.adoption_reason || app.adoptionReason,
        whatIfMoving: app.what_if_moving || app.whatIfMoving,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500 hover:bg-green-600">Aprovada</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejeitada</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">Pendente</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-muted/20">
            <Header />

            <div className="container max-w-5xl py-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/ong-dashboard')}
                    className="mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para Dashboard
                </Button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - 2 Columns */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl mb-2">Detalhes da Candidatura</CardTitle>
                                        <CardDescription>
                                            Enviada em {application.created_at ? format(new Date(application.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : '-'}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(application.status)}
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Candidate Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <CardTitle>Dados do Candidato</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nome Completo</p>
                                        <p className="font-medium">{additionalInfo.fullName || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                        <p className="font-medium">
                                            {additionalInfo.birthDate ? format(new Date(additionalInfo.birthDate), "dd/MM/yyyy") : 'Não informado'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">CPF</p>
                                        <p className="font-medium">{additionalInfo.cpf || 'Não informado'}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{(additionalInfo.email) || 'email@naoinformado.com'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{additionalInfo.phone || 'Telefone não informado'}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Endereço</span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        {additionalInfo.address}, {additionalInfo.city} - {additionalInfo.state}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">CEP: {additionalInfo.zipCode}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Housing Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Home className="h-5 w-5 text-primary" />
                                    <CardTitle>Moradia e Família</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tipo de Moradia</p>
                                        <p className="font-medium capitalize">{additionalInfo.housingType === 'house' ? 'Casa' : 'Apartamento'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Situação</p>
                                        <p className="font-medium capitalize">
                                            {additionalInfo.housingOwnership === 'own' ? 'Própria' :
                                                additionalInfo.housingOwnership === 'rented' ? 'Alugada' : 'De familiares'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Quintal</p>
                                        <p className="font-medium">
                                            {application.has_yard ? 'Sim' : 'Não'}
                                            {application.has_yard && application.yard_fenced && ' (Cercado)'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pessoas na casa</p>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span className="font-medium">{additionalInfo.householdSize} pessoas</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Crianças</p>
                                        <p className="font-medium">{additionalInfo.hasChildren === 'yes' ? `Sim (${additionalInfo.childrenAges})` : 'Não'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Todos de acordo?</p>
                                        <p className="font-medium flex items-center gap-2">
                                            {application.family_agreed ?
                                                <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            }
                                            {application.family_agreed ? 'Sim' : 'Não'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pet Experience & Routine */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Dog className="h-5 w-5 text-primary" />
                                    <CardTitle>Experiência e Rotina</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Possui outros pets?</p>
                                        <p className="font-medium">{application.has_other_pets ? 'Sim' : 'Não'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Já teve pets antes?</p>
                                        <p className="font-medium">{application.has_experience ? 'Sim' : 'Não'}</p>
                                    </div>
                                </div>

                                {application.other_pets_description && (
                                    <div className="bg-muted/30 p-3 rounded-md">
                                        <p className="text-sm font-medium mb-1">Descrição dos pets atuais:</p>
                                        <p className="text-sm text-muted-foreground">{application.other_pets_description}</p>
                                    </div>
                                )}

                                <Separator />

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tempo sozinho (diário)</p>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span className="font-medium">{additionalInfo.dailyHoursAlone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Quem cuida em viagens?</p>
                                    <p className="font-medium">{additionalInfo.whoCaresWhenAway}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Motivation */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <CardTitle>Motivação</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Por que deseja adotar?</p>
                                    <p className="text-sm leading-relaxed">{additionalInfo.adoptionReason}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">O que faria se mudasse?</p>
                                    <p className="text-sm leading-relaxed">{additionalInfo.whatIfMoving}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Actions & Summary */}
                    <div className="space-y-6">
                        {application.status === 'pending' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ações</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => handleUpdateStatus('approved')}
                                        disabled={updating}
                                    >
                                        Aprovar Candidatura
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => handleUpdateStatus('rejected')}
                                        disabled={updating}
                                    >
                                        Rejeitar Candidatura
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Resumo Financeiro</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Preparado financeiramente?</p>
                                    <p className="font-medium capitalize">
                                        {additionalInfo.financialReady === 'yes' ? 'Sim' :
                                            additionalInfo.financialReady === 'partially' ? 'Parcialmente' : 'Não'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Orçamento Mensal</p>
                                    <p className="font-medium text-lg text-green-600 font-semibold">
                                        {additionalInfo.monthlyBudget}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetail;
