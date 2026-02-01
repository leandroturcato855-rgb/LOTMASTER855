import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Check, Trophy, Calendar, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function PublicResults() {
  const [lastBolao, setLastBolao] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLastBolao();
  }, []);

  const fetchLastBolao = async () => {
    setIsLoading(true);
    const { data: bolao } = await supabase
      .from('bolões')
      .select('*')
      .eq('status', 'concluido')
      .order('data_sorteio', { ascending: false })
      .limit(1)
      .single();

    if (bolao) {
      setLastBolao(bolao);
      const { data: apostas } = await supabase
        .from('apostas')
        .select('*')
        .eq('bolao_id', bolao.id)
        .order('score', { ascending: false });
      
      if (apostas) setRanking(apostas);
    }
    setIsLoading(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const shareWhatsApp = () => {
    const message = `🎰 Confira o resultado do sorteio LOTO MASTER!\n\n${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lastBolao) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-8 border-0 shadow-2xl text-center bg-white">
          <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-primary mb-2">LOTO MASTER</h1>
          <p className="text-sm text-muted-foreground">Nenhum resultado disponível no momento.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-primary mb-1">LOTO MASTER</h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" /> Ranking do Sorteio
          </p>
        </div>

        {/* Premiações */}
        <Card className="p-4 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <p className="text-[10px] font-bold uppercase text-white/60">10 Pontos</p>
              <p className="font-black text-lg text-yellow-300">R$ {Number(lastBolao.premios?.["10"] || 0).toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <p className="text-[10px] font-bold uppercase text-white/60">9 Pontos</p>
              <p className="font-black text-lg text-green-300">R$ {Number(lastBolao.premios?.["9"] || 0).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </Card>

        {/* Resultado Oficial */}
        <Card className="p-6 border-0 shadow-lg bg-white">
          <p className="text-[10px] font-black text-primary uppercase mb-4 tracking-widest">✓ Resultado Oficial Lotofácil</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {lastBolao.numeros_sorteados?.map((num: number) => (
              <div key={num} className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl font-black text-sm shadow-md">
                {String(num).padStart(2, "0")}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-4 text-center font-bold">
            {lastBolao.nome} | {new Date(lastBolao.created_at).toLocaleString('pt-BR')}
          </p>
        </Card>

        {/* Suporte */}
        <Card className="p-4 border-l-4 border-l-green-500 shadow-md bg-white flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-gray-800">✨ Bolão Online Loto Master</p>
            <p className="text-[10px] text-gray-500">Fácil, prático e automático.</p>
          </div>
          <Button onClick={() => window.open('https://wa.me/5500000000000', '_blank')} className="bg-green-500 hover:bg-green-600 text-white font-black text-xs h-auto py-2 px-4">
            <MessageCircle className="w-3 h-3 mr-1" /> Suporte
          </Button>
        </Card>

        {/* Ranking */}
        <div className="space-y-3">
          <h2 className="text-lg font-black text-gray-800 uppercase flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary" /> Ranking de Acertos
          </h2>
          {ranking.map((result, idx) => (
            <Card key={result.id} className={`p-4 border-0 shadow-sm flex items-center justify-between ${
              result.score >= 9 ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-white"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                  idx === 0 ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {idx + 1}º
                </div>
                <div>
                  <p className="font-black text-sm text-gray-800 uppercase">{result.player_name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.numbers.map((n: number) => (
                      <span key={n} className={`text-[9px] font-bold px-1 rounded ${
                        lastBolao.numeros_sorteados?.includes(n) ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                      }`}>
                        {String(n).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-inner ${
                result.score >= 9 ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {result.score}
              </div>
            </Card>
          ))}
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
          <Button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4">
            {copied ? "LINK COPIADO!" : "COPIAR LINK"}
          </Button>
          <Button onClick={shareWhatsApp} className="bg-green-500 hover:bg-green-600 text-white font-black py-4">
            COMPARTILHAR WHATSAPP
          </Button>
        </div>

        <p className="text-center text-[10px] text-gray-400 font-bold pt-6">
          © 2026 LOTO MASTER - SISTEMA DE GERENCIAMENTO DE BOLÕES
        </p>
      </div>
    </div>
  );
}
