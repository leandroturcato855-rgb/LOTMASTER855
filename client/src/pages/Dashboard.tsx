import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Users, List, Dice5, Trophy, MessageCircle } from "lucide-react";
import RegisterBets from "@/components/RegisterBets";
import Participants from "@/components/Participants";
import CurrentGames from "@/components/CurrentGames";
import DrawLottery from "@/components/DrawLottery";
import LastBolan from "@/components/LastBolan";
import { useAuth } from "@/contexts/AuthContext";

type Page = "register" | "participants" | "draw" | "conference" | "lastbolan";

export default function Dashboard() {
  const { role, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("register");
  const [, navigate] = useLocation();

  // Se for casual, só pode ver a página de registro
  useEffect(() => {
    if (role === 'casual' && currentPage !== 'register') {
      setCurrentPage('register');
    }
  }, [role, currentPage]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const menuItems = [
    { id: "register", label: "Aposte", icon: Plus, roles: ["admin", "vendedor", "casual"] },
    { id: "participants", label: "Lista Válida", icon: Users, roles: ["admin", "vendedor"] },
    { id: "conference", label: "Últimas Apostas", icon: List, roles: ["admin", "vendedor"] },
    { id: "draw", label: "Sorteio", icon: Dice5, roles: ["admin"] },
    { id: "lastbolan", label: "Último Bolão", icon: Trophy, roles: ["admin", "vendedor", "casual"] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 shadow-sm md:shadow-none flex flex-col">
        <div className="p-4 md:p-6 flex justify-between items-start">
          <div>
            <h1 className="font-display text-xl md:text-2xl text-primary mb-1 font-bold">
              LOTO MASTER
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {role === 'admin' ? 'Administrador' : role === 'vendedor' ? 'Vendedor' : 'Apostador'}
            </p>
          </div>
          <Button
            onClick={() => window.open(import.meta.env.VITE_WHATSAPP_LINK || 'https://wa.me', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 h-auto flex items-center gap-1"
          >
            <MessageCircle className="w-3 h-3" />
            Suporte
          </Button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 space-y-1 px-4 flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible py-2">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Page)}
              className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap md:whitespace-normal ${
                currentPage === item.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-gray-100"
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentPage === item.id ? "text-white" : "text-primary"}`} />
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {currentPage === "register" && <RegisterBets />}
          {currentPage === "participants" && <Participants />}
          {currentPage === "draw" && <DrawLottery />}
          {currentPage === "conference" && <CurrentGames />}
          {currentPage === "lastbolan" && <LastBolan />}
        </div>
      </main>
    </div>
  );
}
