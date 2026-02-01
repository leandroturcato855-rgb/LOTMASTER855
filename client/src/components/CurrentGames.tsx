import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Search, ListFilter } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

export default function CurrentGames() {
  const { role, user } = useAuth();
  const [lastGames, setLastGames] = useState<any[]>([]);
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeBolao, setActiveBolao] = useState<any>(null);

  useEffect(() => {
    fetchActiveBolao();
    fetchLastGames();
  }, []);

  const fetchActiveBolao = async () => {
    const { data } = await supabase
      .from('bolões')
      .select('*')
      .eq('status', 'aberto')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (data) setActiveBolao(data);
  };

  const fetchLastGames = async () => {
    setIsLoading(true);
    // Buscar apostas do último bolão concluído ou de todos os bolões anteriores
    let query = supabase
      .from('apostas')
      .select('*, bolões(nome)')
      .order('created_at', { ascending: false });

    if (role === 'vendedor') {
      query = query.eq('vendedor_id', user?.id);
    }

    const { data, error } = await query;

    if (data) setLastGames(data);
    setIsLoading(false);
  };

  const handleToggleGame = (id: string) => {
    const updated = new Set(selectedGames);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedGames(updated);
  };

  const handleRepeatGames = async () => {
    if (selectedGames.size === 0) {
      toast.error("Selecione pelo menos um jogo para repetir");
      return;
    }

    if (!activeBolao) {
      toast.error("Não há um bolão aberto para repetir os jogos");
      return;
    }

    const gamesToRepeat = lastGames.filter((g) => selectedGames.has(g.id));
    
    try {
      const dataToInsert = gamesToRepeat.map(g => ({
        bolao_id: activeBolao.id,
        vendedor_id: user?.id,
        player_name: g.player_name,
        numbers: g.numbers,
        game_number: g.game_number, // Pode precisar de ajuste se o jogador já tiver jogos no bolão atual
        status: 'validada'
      }));

      const { error } = await supabase.from('apostas').insert(dataToInsert);

      if (error) throw error;

      toast.success(`${selectedGames.size} jogo(s) repetidos no bolão atual!`);
      setSelectedGames(new Set());
    } catch (error: any) {
      toast.error("Erro ao repetir jogos: " + error.message);
    }
  };

  const filteredGames = lastGames.filter(g => 
    g.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1 uppercase">
            ÚLTIMAS APOSTAS
          </h2>
          <p className="text-sm text-muted-foreground">
            Histórico de jogos realizados por você
          </p>
        </div>
        <Button
          onClick={handleRepeatGames}
          disabled={selectedGames.size === 0 || !activeBolao}
          className="bg-accent hover:bg-accent/90 text-white font-black py-6 px-8 shadow-lg disabled:opacity-50"
        >
          REPETIR JOGOS SELECIONADOS ({selectedGames.size})
        </Button>
      </div>

      <Card className="p-4 border-0 shadow-md bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar no histórico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200"
          />
        </div>
      </Card>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-4 text-left w-10">
                  <ListFilter className="w-4 h-4 text-gray-400" />
                </th>
                <th className="py-4 px-4 text-left font-black text-gray-500 uppercase text-[10px]">Apostador</th>
                <th className="py-4 px-4 text-left font-black text-gray-500 uppercase text-[10px]">Bolão Original</th>
                <th className="py-4 px-4 text-center font-black text-gray-500 uppercase text-[10px]">Números</th>
                <th className="py-4 px-4 text-center font-black text-gray-500 uppercase text-[10px]">Acertos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredGames.map((game) => (
                <tr key={game.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedGames.has(game.id)}
                      onChange={() => handleToggleGame(game.id)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-700 uppercase">{game.player_name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">JOGO #{String(game.game_number).padStart(2, '0')}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-bold text-gray-500">{game.bolões?.nome || 'N/A'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                      {game.numbers.map((num: number) => (
                        <span key={num} className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                          {String(num).padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block w-8 h-8 leading-8 rounded-full font-black text-xs ${
                      game.score >= 9 ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-400"
                    }`}>
                      {game.score ?? '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredGames.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic">
            Nenhum histórico de apostas encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
