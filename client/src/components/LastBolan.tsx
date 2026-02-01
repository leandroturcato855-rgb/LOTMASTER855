import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Share2, Copy, Check, Search, Calendar, Medal } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

export default function LastBolan() {
  const [lastBolao, setLastBolao] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLastBolao();
  }, []);

  const fetchLastBolao = async () => {
    setIsLoading(true);
    // Buscar o último bolão concluído
    const { data: bolao } = await supabase
      .from('bolões')
      .select('*')
      .eq('status', 'concluido')
      .order('data_sorteio', { ascending: false })
      .limit(1)
      .single();

    if (bolao) {
      setLastBolao(bolao);
      // Buscar apostas desse bolão ordenadas por score
      const { data: apostas } = await supabase
        .from('apostas')
        .select('*')
        .eq('bolao_id', bolao.id)
        .order('score', { ascending: false });
      
      if (apostas) setRanking(apostas);
    }
    setIsLoading(false);
  };

  const handleCopyPublicLink = () => {
    const publicLink = `${window.location.origin}/public`;
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const publicLink = `${window.location.origin}/public`;
    const message = `🎰 Confira o ranking do último bolão LOTO MASTER!\n\n${publicLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredRanking = ranking.filter(r => 
    r.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  if (!lastBolao) {
    return (
      <Card className="p-10 text-center border-0 shadow-lg bg-white">
        <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-400">Nenhum bolão concluído ainda</h3>
        <p className="text-sm text-gray-400 mt-2">Os resultados aparecerão aqui após a conclusão de um sorteio.</p>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1 uppercase flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" /> ÚLTIMO BOLÃO
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {lastBolao.nome} - Finalizado em {new Date(lastBolao.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopyPublicLink} variant="outline" className="flex items-center gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Link Público
          </Button>
          <Button onClick={handleShareWhatsApp} className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Resultado do Sorteio */}
      <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-primary to-blue-900 text-white">
        <p className="text-[10px] font-black uppercase text-white/60 mb-3 tracking-widest">Resultado Oficial Lotofácil</p>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {lastBolao.numeros_sorteados?.map((n: number) => (
            <div key={n} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white text-primary rounded-xl font-black text-lg shadow-lg">
              {String(n).padStart(2, '0')}
            </div>
          ))}
        </div>
      </Card>

      {/* Premiações */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(lastBolao.premios || {}).map(([pts, val]) => (
          <Card key={pts} className="p-4 border-0 shadow-md bg-white text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{pts === "0" ? "Zero Pontos" : `${pts} Pontos`}</p>
            <p className="text-lg font-black text-primary">R$ {Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </Card>
        ))}
      </div>

      {/* Ranking */}
      <Card className="p-4 border-0 shadow-md bg-white">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar no ranking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200"
          />
        </div>

        <div className="space-y-3">
          {filteredRanking.map((result, idx) => (
            <div 
              key={result.id} 
              className={`p-4 rounded-xl border-l-4 flex items-center justify-between transition-all ${
                result.score >= 9 ? "bg-yellow-50 border-yellow-400 shadow-sm" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                  idx === 0 ? "bg-yellow-400 text-white" : idx === 1 ? "bg-gray-300 text-white" : idx === 2 ? "bg-orange-300 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {idx + 1}º
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-800 uppercase">{result.player_name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.numbers.map((n: number) => (
                      <span key={n} className={`text-[9px] font-bold px-1 rounded ${
                        lastBolao.numeros_sorteados?.includes(n) ? "bg-green-500 text-white" : "bg-white text-gray-400 border border-gray-100"
                      }`}>
                        {String(n).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-inner ${
                  result.score >= 9 ? "bg-yellow-400 text-white" : "bg-white text-gray-400 border border-gray-100"
                }`}>
                  <span className="text-lg font-black leading-none">{result.score}</span>
                  <span className="text-[8px] font-bold uppercase">pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
