import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { X, Shuffle, Share2, Copy, Check, Save, Send } from "lucide-react";
import { generateRandomNumbers, generateGameNumber, formatGameLabel } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Game {
  id?: string;
  playerName: string;
  numbers: number[];
  gameNumber: number;
  timestamp: number;
}

export default function RegisterBets() {
  const { role, user } = useAuth();
  const [playerName, setPlayerName] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [gamesToAdd, setGamesToAdd] = useState<Game[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeBolao, setActiveBolao] = useState<any>(null);

  useEffect(() => {
    fetchActiveBolao();
  }, []);

  const fetchActiveBolao = async () => {
    const { data, error } = await supabase
      .from('bolões')
      .select('*')
      .eq('status', 'aberto')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (data) setActiveBolao(data);
  };

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      if (selectedNumbers.length < 10) {
        setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
      } else {
        toast.error("Máximo de 10 números selecionados");
      }
    }
  };

  const handleRandomGame = () => {
    if (!playerName.trim()) {
      toast.error("Insira o nome do apostador");
      return;
    }
    const randomNumbers = generateRandomNumbers();
    setSelectedNumbers(randomNumbers);
  };

  const handleAddGameToList = () => {
    if (!playerName.trim()) {
      toast.error("Insira o nome do apostador");
      return;
    }

    if (playerName.length > 30) {
      toast.error("Nome não pode exceder 30 caracteres");
      return;
    }

    if (selectedNumbers.length !== 10) {
      toast.error("Selecione exatamente 10 números");
      return;
    }

    const gameNumber = generateGameNumber(playerName.toUpperCase(), gamesToAdd as any);
    const newGame: Game = {
      playerName: playerName.toUpperCase(),
      numbers: selectedNumbers,
      gameNumber,
      timestamp: Date.now(),
    };

    setGamesToAdd([...gamesToAdd, newGame]);
    setSelectedNumbers([]);
  };

  const handleSaveAllGames = async () => {
    if (gamesToAdd.length === 0) {
      toast.error("Adicione pelo menos um jogo à lista");
      return;
    }

    if (!activeBolao && role !== 'casual') {
      toast.error("Não há bolão aberto no momento");
      return;
    }

    setIsSaving(true);

    if (role === 'casual') {
      // Para casual, gera notificação e link de WhatsApp
      const gamesText = gamesToAdd.map(g => 
        `${g.playerName}: ${g.numbers.map(n => String(n).padStart(2, '0')).join(', ')}`
      ).join('\n');
      
      const message = `Olá ADM, gostaria de validar minhas apostas:\n\n${gamesText}`;
      const whatsappUrl = `https://wa.me/5500000000000?text=${encodeURIComponent(message)}`;
      
      navigator.clipboard.writeText(message);
      toast.success("VALIDE SUA APOSTA COM ADM! Aposta copiada.");
      
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        setGamesToAdd([]);
        setPlayerName("");
        setIsSaving(false);
      }, 1500);
      
    } else {
      // Para Vendedor/Admin, salva no Supabase
      try {
        const dataToInsert = gamesToAdd.map(g => ({
          bolao_id: activeBolao.id,
          vendedor_id: user?.id,
          player_name: g.playerName,
          numbers: g.numbers,
          game_number: g.gameNumber,
          status: 'validada'
        }));

        const { error } = await supabase.from('apostas').insert(dataToInsert);

        if (error) throw error;

        toast.success(`${gamesToAdd.length} jogo(s) salvos na lista válida!`);
        setGamesToAdd([]);
        setPlayerName("");
      } catch (error: any) {
        toast.error("Erro ao salvar apostas: " + error.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const removeGameFromList = (idx: number) => {
    setGamesToAdd(gamesToAdd.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-4xl space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-display text-foreground mb-1 font-bold">
            {activeBolao ? activeBolao.nome : "Bolão Lotofácil"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Selecione 10 números de 01 a 25
          </p>
        </div>
        {role !== 'casual' && !activeBolao && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
            NENHUM BOLÃO ATIVO
          </div>
        )}
      </div>

      <Card className="p-4 border-0 shadow-lg bg-white">
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
            Nome do Apostador
          </label>
          <Input
            type="text"
            placeholder="NOME COMPLETO"
            value={playerName.toUpperCase()}
            onChange={(e) => setPlayerName(e.target.value.toUpperCase().slice(0, 30))}
            maxLength={30}
            className="border-gray-300 font-bold"
          />
          <p className="text-[10px] text-muted-foreground mt-1 text-right">
            {playerName.length}/30 caracteres
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase text-gray-500 mb-3">
            Selecione 10 Números (Grid 5x5)
          </label>
          <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                className={`h-12 w-12 rounded-lg text-sm font-black transition-all ${
                  selectedNumbers.includes(num)
                    ? "bg-primary text-white shadow-lg scale-110"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                {String(num).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">
            Números Selecionados: {selectedNumbers.length}/10
          </label>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedNumbers.length > 0 ? (
              selectedNumbers.map((num) => (
                <span
                  key={num}
                  className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary rounded-full text-xs font-bold"
                >
                  {String(num).padStart(2, "0")}
                </span>
              ))
            ) : (
              <p className="text-gray-400 text-xs italic">Nenhum número selecionado</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleRandomGame}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 py-6 border-2"
          >
            <Shuffle className="w-5 h-5" />
            ALEATÓRIO
          </Button>

          <Button
            onClick={handleAddGameToList}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-6 shadow-lg"
          >
            ADICIONAR APOSTA
          </Button>
        </div>
      </Card>

      {gamesToAdd.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <List className="w-5 h-5 text-primary" />
            Apostas na Lista ({gamesToAdd.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {gamesToAdd.map((game, idx) => (
              <Card key={idx} className="p-3 border-0 shadow-sm bg-white relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-xs text-primary">
                      {game.playerName} | {String(game.gameNumber).padStart(2, "0")}
                    </h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {game.numbers.map((num) => (
                        <span key={num} className="text-[10px] font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded">
                          {String(num).padStart(2, "0")}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => removeGameFromList(idx)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleSaveAllGames}
            disabled={isSaving}
            className={`w-full py-8 text-lg font-black shadow-xl transition-all ${
              role === 'casual' 
                ? "bg-green-500 hover:bg-green-600" 
                : "bg-accent hover:bg-accent/90"
            }`}
          >
            {isSaving ? "PROCESSANDO..." : role === 'casual' ? (
              <span className="flex items-center gap-2">
                <Send className="w-6 h-6" /> COMPARTILHAR COM ADM
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-6 h-6" /> SALVAR APOSTAS NA LISTA
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
