import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, X, Share2, Copy, Check, Trash2, Edit2, ExternalLink, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Participants() {
  const { role, user } = useAuth();
  const [savedGames, setSavedGames] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeBolao, setActiveBolao] = useState<any>(null);

  useEffect(() => {
    fetchActiveBolao();
  }, []);

  useEffect(() => {
    if (activeBolao) {
      fetchGames();
    }
  }, [activeBolao]);

  const fetchActiveBolao = async () => {
    const { data, error } = await supabase
      .from('bolões')
      .select('*')
      .eq('status', 'aberto')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (data) setActiveBolao(data);
    else setIsLoading(false);
  };

  const fetchGames = async () => {
    setIsLoading(true);
    let query = supabase
      .from('apostas')
      .select('*')
      .eq('bolao_id', activeBolao.id)
      .eq('status', 'validada')
      .order('player_name', { ascending: true });

    if (role === 'vendedor') {
      query = query.eq('vendedor_id', user?.id);
    }

    const { data, error } = await query;

    if (data) setSavedGames(data);
    setIsLoading(false);
  };

  const removeGame = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aposta?")) return;

    const { error } = await supabase.from('apostas').delete().eq('id', id);

    if (error) {
      toast.error("Erro ao excluir: " + error.message);
    } else {
      toast.success("Aposta removida");
      setSavedGames(savedGames.filter(g => g.id !== id));
    }
  };

  const handleCopyPublicLink = () => {
    const publicLink = `${window.location.origin}/public-list`;
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveList = async () => {
    if (role !== 'admin') return;
    
    if (!confirm("Deseja encerrar as apostas e validar esta lista para o sorteio?")) return;

    const { error } = await supabase
      .from('bolões')
      .update({ status: 'encerrado' })
      .eq('id', activeBolao.id);

    if (error) {
      toast.error("Erro ao salvar lista: " + error.message);
    } else {
      toast.success("Lista salva! O bolão agora está pronto para o sorteio.");
      setActiveBolao({ ...activeBolao, status: 'encerrado' });
    }
  };

  const filteredGames = savedGames.filter((game) =>
    game.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!activeBolao) {
    return (
      <Card className="p-10 text-center border-0 shadow-lg bg-white">
        <h3 className="text-xl font-bold text-gray-400">Nenhum bolão ativo no momento</h3>
        <p className="text-sm text-gray-400 mt-2">Crie um novo bolão na área administrativa para começar.</p>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1">
            LISTA VÁLIDA
          </h2>
          <p className="text-sm text-muted-foreground">
            {savedGames.length} apostas confirmadas no {activeBolao.nome}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCopyPublicLink}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Link Público
          </Button>
          {role === 'admin' && activeBolao.status === 'aberto' && (
            <Button
              onClick={handleSaveList}
              className="bg-accent hover:bg-accent/90 text-white font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              SALVAR LISTA
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4 border-0 shadow-md bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar por nome do apostador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <Card key={game.id} className="p-4 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-black text-sm text-primary uppercase truncate max-w-[150px]">
                    {game.player_name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold">JOGO #{String(game.game_number).padStart(2, '0')}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => removeGame(game.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {game.numbers.map((num: number) => (
                  <span key={num} className="flex items-center justify-center bg-gray-50 border border-gray-100 rounded text-[10px] font-bold py-1">
                    {String(num).padStart(2, '0')}
                  </span>
                ))}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-gray-400 italic">
            Nenhuma aposta encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
