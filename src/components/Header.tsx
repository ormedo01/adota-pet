import { Link, useNavigate } from "react-router-dom";
import { Heart, LogIn, LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavLinks = () => (
    <>
      <Link to="/pets" className="text-sm font-medium hover:text-primary transition-colors">
        Adotar
      </Link>
      <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
        Como Funciona
      </Link>
      {!isAuthenticated && (
        <Link to="/ong-dashboard" className="text-sm font-medium hover:text-primary transition-colors">
          Área ONG
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AdotaPet
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Desktop User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={user?.type === "ong" ? "/ong-dashboard" : "/adopter-dashboard"}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu - Authenticated */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col gap-4 mt-8">
                    <div className="pb-4 border-b">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.type === "ong" ? "ONG" : "Adotante"}
                      </p>
                    </div>
                    <NavLinks />
                    <Button asChild variant="ghost">
                      <Link to={user?.type === "ong" ? "/ong-dashboard" : "/adopter-dashboard"}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="justify-start text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden md:flex">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register">Cadastrar</Link>
              </Button>

              {/* Mobile Menu - Not Authenticated */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col gap-4 mt-8">
                    <NavLinks />
                    <Button asChild variant="ghost">
                      <Link to="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Entrar
                      </Link>
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
