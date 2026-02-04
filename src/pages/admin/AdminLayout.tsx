import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Activity, Dog, Users, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="flex min-h-screen w-full bg-muted/20">
            <aside className="hidden border-r bg-white lg:block w-64 fixed h-full z-10">
                <div className="flex h-full flex-col gap-2">
                    <div className="flex h-[64px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-bold text-xl" to="/admin/dashboard">
                            <span className="text-primary">AdotaPet</span> Admin
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-4 px-4">
                        <nav className="grid items-start gap-2 font-medium">
                            <Link
                                to="/admin/dashboard"
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    isActive("/admin/dashboard")
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Activity className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                to="/admin/users"
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    isActive("/admin/users")
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Users className="h-4 w-4" />
                                Usuários
                            </Link>
                            <Link
                                to="/admin/pets"
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    isActive("/admin/pets")
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Dog className="h-4 w-4" />
                                Animais
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto p-4 border-t">
                        <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </button>
                    </div>
                </div>
            </aside>
            <main className="flex-1 lg:pl-64">
                <div className="h-full p-8 w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
