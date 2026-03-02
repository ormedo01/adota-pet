import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Search, CheckCircle2, MessageCircle, ArrowRight, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="min-h-screen flex flex-col bg-muted/20">
            <Header />

            <main className="flex-grow">
                {/* Banner Section */}
                <section className="bg-gradient-to-r from-primary to-accent py-20 text-white">
                    <div className="container px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Como o AdotaPet Funciona</h1>
                        <p className="text-xl max-w-2xl mx-auto opacity-90">
                            Transformando a adoção de pets em um processo simples, seguro e cheio de amor.
                            Conectamos ONGs dedicadas e famílias responsáveis.
                        </p>
                    </div>
                </section>

                {/* Para Adotantes Section */}
                <section className="py-20 bg-background">
                    <div className="container px-4">
                        <div className="flex flex-col items-center mb-16">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold text-center">Para quem quer Adotar</h2>
                            <p className="text-muted-foreground text-center mt-4 max-w-2xl">
                                O caminho para encontrar o seu novo melhor amigo é simples e transparente.
                                Acompanhe o passo a passo de como levar um pet para casa.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: <Search className="w-8 h-8 text-white" />,
                                    title: "1. Encontre seu Pet",
                                    description: "Navegue pela nossa vitrine de animais, filtre por espécie, porte ou localização."
                                },
                                {
                                    icon: <Heart className="w-8 h-8 text-white" />,
                                    title: "2. Candidate-se",
                                    description: "Ao achar o pet perfeito, preencha o formulário de intenção de adoção demonstrando seu interesse."
                                },
                                {
                                    icon: <MessageCircle className="w-8 h-8 text-white" />,
                                    title: "3. Avaliação da ONG",
                                    description: "A ONG responsável analisará seu perfil e entrará em contato para os próximos passos."
                                },
                                {
                                    icon: <CheckCircle2 className="w-8 h-8 text-white" />,
                                    title: "4. Adoção Finalizada",
                                    description: "Com tudo aprovado, você pode buscar seu novo companheiro e iniciar uma linda história."
                                }
                            ].map((step, idx) => (
                                <div key={idx} className="relative flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>

                                    {idx < 3 && (
                                        <div className="hidden md:block absolute top-10 left-[60%] w-full">
                                            <ArrowRight className="w-8 h-8 text-muted/30 mx-auto" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Button asChild size="lg" className="rounded-full px-8">
                                <Link to="/pets">Encontrar meu Pet</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Para ONGs Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container px-4">
                        <div className="flex flex-col items-center mb-16">
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                                <Building2 className="h-8 w-8 text-secondary" />
                            </div>
                            <h2 className="text-3xl font-bold text-center">Para ONGs e Protetores</h2>
                            <p className="text-muted-foreground text-center mt-4 max-w-2xl">
                                Uma ferramenta completa para gerenciar seus animais disponíveis e encontrar
                                as melhores famílias para eles, sem custos.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {[
                                {
                                    title: "Visibilidade",
                                    desc: "Seus animais cadastrados ganham destaque e alcançam milhares de possíveis adotantes na sua região."
                                },
                                {
                                    title: "Gestão Unificada",
                                    desc: "Gerencie perfis de pets, acompanhe candidatos e centralize todas as intenções de adoção em um único painel."
                                },
                                {
                                    title: "Adoções Responsáveis",
                                    desc: "Receba o perfil detalhado dos adotantes e tome decisões mais seguras de quem levará o animal."
                                }
                            ].map((feature, idx) => (
                                <Card key={idx} className="border-secondary/20 hover:border-secondary transition-colors duration-300">
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-bold mb-3 text-secondary">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Button asChild variant="secondary" size="lg" className="rounded-full px-8">
                                <Link to="/register">Cadastrar minha ONG</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Basic Footer if a complex one isn't imported correctly */}
            <footer className="bg-foreground text-background py-8 text-center mt-auto">
                <p className="opacity-80">© {new Date().getFullYear()} AdotaPet. Todos os direitos reservados.</p>
                <p className="opacity-60 text-sm mt-2">Conectando corações e patinhas ❤️</p>
            </footer>
        </div>
    );
};

export default About;
