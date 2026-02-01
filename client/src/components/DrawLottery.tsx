import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Dice5, CheckCircle2, Save, Trophy, AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function DrawLottery() {
  const { role } = useAuth();
  const [activeBolao, setActiveBolao] = useState<any>(null);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [prizes, setPrizes] = useState({ "10": "", "9": "", "8": "", "0": "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [bolaoName, setBolaoName] = useState("");

  useEffect(() => {
    fetchActiveBolao();
  }, []);

  const fetchActiveBolao = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bolões')
      .select('*')
      .in('status', ['aberto', 'encerrado'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (data) {
      setActiveBolao(data);
      setDrawnNumbers(data.numeros_sorteados || []);
      setPrizes({
        "10": data.premios?.["10"]?.toString() || "",
        "9": data.premios?.["9"]?.toString() || "",
        "8": data.premios?.["8"]?.toString() || "",
        "0": data.premios?.["0"]?.toString() || ""
      });
    }
    setIsLoading(false);
  };

  const handleCreateBolao = async () => {
    if (!bolaoName) {
      toast.error("Dê um nome ao bolão");
      return;
    }

    const { data, error } = await supabase
      .from('bolões')
      .insert([{ nome: bolaoName, status: 'aberto' }])
      .select()
      .single();

    if (error) {
      toast.error("Erro ao criar bolão: " + error.message);
    } else {
      toast.success("Novo bolão criado!");
      setActiveBolao(data);
      setBolaoName("");
    }
  };

  const toggleNumber = (num: number) => {
    if (drawnNumbers.includes(num)) {
      setDrawnNumbers(drawnNumbers.filter((n) => n !== num));
    } else {
      if (drawnNumbers.length < 15) {
        setDrawnNumbers([...drawnNumbers, num].sort((a, b) => a - b));
      } else {
        toast.error("Máximo de 15 números");
      }
    }
  };

  const handleValidateDraw = async () => {
    if (drawnNumbers.length !== 15) {
      toast.error("Selecione exatamente 15 números");
      return;
    }

    setIsCalculating(true);
    try {
      // 1. Buscar todas as apostas do bolão
      const { data: apostas, error: fetchError } = await supabase
        .from('apostas')
        .select('*')
        .eq('bolao_id', activeBolao.id);

      if (fetchError) throw fetchError;

      // 2. Calcular acertos para cada aposta
      const updates = apostas.map(aposta => {
        const hits = aposta.numbers.filter((n: number) => drawnNumbers.includes(n));
        return {
          id: aposta.id,
          hits: hits,
          score: hits.length
        };
      });

      // 3. Atualizar apostas no banco (em lote)
      for (const update of updates) {
        await supabase.from('apostas').update({ hits: update.hits, score: update.score }).eq('id', update.id);
      }

      // 4. Calcular estatísticas
      const counts = { "10": 0, "9": 0, "8": 0, "0": 0 };
      updates.forEach(u => {
        if (u.score === 10) counts["10"]++;
        else if (u.score === 9) counts["9"]++;
        else if (u.score === 8) counts["8"]++;
        else if (u.score === 0) counts["0"]++;
      });
      setStats(counts);

      // 5. Atualizar bolão com números sorteados e prêmios
      await supabase.from('bolões').update({
        numeros_sorteados: drawnNumbers,
        premios: {
          "10": parseFloat(prizes["10"]) || 0,
          "9": parseFloat(prizes["9"]) || 0,
          "8": parseFloat(prizes["8"]) || 0,
          "0": parseFloat(prizes["0"]) || 0
        }
      }).eq('id', activeBolao.id);

      toast.success("Sorteio validado e acertos calculados!");
    } catch (error: any) {
      toast.error("Erro ao validar sorteio: " + error.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleFinalizeBolao = async () => {
    if (!confirm("Deseja concluir este bolão? Ele será movido para o histórico.")) return;

    const { error } = await supabase
      .from('bolões')
      .update({ status: 'concluido' })
      .eq('id', activeBolao.id);

    if (error) {
      toast.error("Erro ao concluir: " + error.message);
    } else {
      toast.success("Bolão concluído com sucesso!");
      setActiveBolao(null);
      setStats(null);
      setDrawnNumbers([]);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><RefreshCw className="animate-spin w-10 h-10 text-primary" /></div>;

  if (!activeBolao) {
    return (
      <div className="max-w-md mx-auto py-10">
        <Card className="p-6 border-0 shadow-xl bg-white">
          <h2 className="text-2xl font-black text-primary mb-4">NOVO BOLÃO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome do Bolão</label>
              <Input 
                placeholder="Ex: BOLÃO DA VIRADA" 
                value={bolaoName}
                onChange={(e) => setBolaoName(e.target.value.toUpperCase())}
                className="font-bold"
              />
            </div>
            <Button onClick={handleCreateBolao} className="w-full bg-primary font-bold py-6">
              CRIAR BOLÃO AGORA
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1 uppercase">
            ÁREA DE SORTEIO
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerenciando: <span className="font-bold text-primary">{activeBolao.nome}</span>
          </p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
          {activeBolao.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Premiações */}
        <Card className="p-5 border-0 shadow-lg bg-white lg:col-span-1">
          <h3 className="text-sm font-black text-gray-500 uppercase mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" /> Premiações
          </h3>
          <div className="space-y-4">
            {["10", "9", "8", "0"].map((p) => (
              <div key={p}>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  {p === "0" ? "ZERO PONTOS" : `${p} PONTOS`}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">R$</span>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={prizes[p as keyof typeof prizes]}
                    onChange={(e) => setPrizes({ ...prizes, [p]: e.target.value })}
                    className="pl-8 font-bold text-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Grid de Sorteio */}
        <Card className="p-5 border-0 shadow-lg bg-white lg:col-span-2">
          <h3 className="text-sm font-black text-gray-500 uppercase mb-4 flex items-center gap-2">
            <Dice5 className="w-4 h-4 text-primary" /> Sorteio Oficial Lotofácil
          </h3>
          
          <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto mb-6">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                className={`h-10 w-10 rounded-full text-xs font-black transition-all ${
                  drawnNumbers.includes(num)
                    ? "bg-green-500 text-white shadow-md scale-110"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                {String(num).padStart(2, "0")}
              </button>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mb-6">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 text-center">Números Sorteados ({drawnNumbers.length}/15)</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {drawnNumbers.map(n => (
                <span key={n} className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-lg text-xs font-black shadow-sm">
                  {String(n).padStart(2, '0')}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleValidateDraw}
              disabled={isCalculating || drawnNumbers.length !== 15}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-black py-6 shadow-lg"
            >
              {isCalculating ? "CALCULANDO..." : "VALIDAR SORTEIO"}
            </Button>
          </div>
        </Card>
      </div>

      {stats && (
        <Card className="p-6 border-0 shadow-2xl bg-gradient-to-br from-primary to-blue-900 text-white animate-in zoom-in-95 duration-300">
          <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" /> Resumo de Acertos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(stats).map(([pts, count]) => (
              <div key={pts} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                <p className="text-[10px] font-bold uppercase text-white/60 mb-1">{pts === "0" ? "Zero Pontos" : `${pts} Pontos`}</p>
                <p className="text-3xl font-black">{count as number}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <Button 
              onClick={handleFinalizeBolao}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black py-6"
            >
              CONCLUIR E SALVAR BOLÃO
            </Button>
            <Button variant="outline" className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold py-6">
              EDITAR SORTEIO
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
