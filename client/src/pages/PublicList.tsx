import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Check, List, Search, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

export default function PublicList() {
  const [activeBolao, setActiveBolao] = useState<any>(null);
  const [apostas, setApostas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchActiveBolao();
  }, []);

  const fetchActiveBolao = async () => {
    setIsLoading(true);
    const { data: bolao } = await supabase
      .from('bolões')
      .select('*')
      .eq('status', 'aberto')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (bolao) {
      setActiveBolao(bolao);
      const { data: list } = await supabase
        .from('apostas')
        .select('*')
        .eq('bolao_id', bolao.id)
        .order('player_name', { ascending: true });
      
      if (list) setApostas(list);
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
    const message = `🎰 Confira a lista de apostas do bolão LOTO MASTER!\n\n${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredApostas = apostas.filter(a => 
    a.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!activeBolao) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-8 border-0 shadow-2xl text-center bg-white">
          <List className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-primary mb-2">LOTO MASTER</h1>
          <p className="text-sm text-muted-foreground">Nenhuma lista pública disponível no momento.</p>
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
            <List className="w-4 h-4 text-primary" /> Lista de Apostas Válidas
          </p>
        </div>

        {/* Info Bolão */}
        <Card className="p-6 border-0 shadow-lg bg-white text-center">
          <h2 className="text-xl font-black text-gray-800 uppercase mb-1">{activeBolao.nome}</h2>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Apostas Abertas</p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-around">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total de Apostas</p>
              <p className="text-xl font-black text-gray-800">{apostas.length}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
              <p className="text-xl font-black text-green-500 uppercase">Ativo</p>
            </div>
          </div>
        </Card>

        {/* Suporte */}
        <Card className="p-4 border-l-4 border-l-green-500 shadow-md bg-white flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-gray-800">✨ Quer participar do bolão?</p>
            <p className="text-[10px] text-gray-500">Entre em contato com um administrador.</p>
          </div>
          <Button onClick={() => window.open('https://wa.me/5500000000000', '_blank')} className="bg-green-500 hover:bg-green-600 text-white font-black text-xs h-auto py-2 px-4">
            <MessageCircle className="w-3 h-3 mr-1" /> Suporte
          </Button>
        </Card>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Pesquisar seu nome na lista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-0 shadow-md h-12 rounded-xl"
          />
        </div>

        {/* Lista */}
        <div className="grid grid-cols-1 gap-3">
          {filteredApostas.map((aposta) => (
            <Card key={aposta.id} className="p-4 border-0 shadow-sm bg-white flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p className="font-black text-sm text-gray-800 uppercase">{aposta.player_name}</p>
                <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">JOGO #{String(aposta.game_number).padStart(2, '0')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {aposta.numbers.map((n: number) => (
                  <span key={n} className="w-7 h-7 flex items-center justify-center bg-gray-50 text-gray-600 rounded-lg text-[10px] font-black border border-gray-100">
                    {String(n).padStart(2, '0')}
                  </span>
                ))}
              </div>
            </Card>
          ))}
          {filteredApostas.length === 0 && (
            <p className="text-center py-10 text-gray-400 italic text-sm">Nenhuma aposta encontrada com este nome.</p>
          )}
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
