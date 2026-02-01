import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rbikopikencverqxxkbl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaWtvcGlrZW5jdmVycXh4a2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODAxMzIsImV4cCI6MjA4NTU1NjEzMn0.9zPvhjndMw0bsIGNvfuVclO-7BLZlhlSFlr_DiMvglk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface PublicRanking {
  id: string;
  nome: string;
  pontos: number;
  data: string;
  created_at: string;
  updated_at: string;
}

export async function getPublicRanking(): Promise<PublicRanking[]> {
  try {
    const { data, error } = await supabase
      .from('public_ranking')
      .select('*')
      .order('pontos', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar ranking:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    return [];
  }
}

export async function subscribeToPublicRanking(
  callback: (data: PublicRanking[]) => void
) {
  const subscription = supabase
    .channel('public_ranking_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'public_ranking' },
      () => {
        getPublicRanking().then(callback);
      }
    )
    .subscribe();

  return subscription;
}

export async function exportRankingToSupabase(results: any[]): Promise<boolean> {
  try {
    // Limpar dados antigos
    await supabase.from('public_ranking').delete().neq('id', '');

    // Preparar dados para inserção
    const dataToInsert = results.map((result) => ({
      nome: result.game.playerName,
      pontos: result.score,
    }));

    // Inserir novos dados
    const { error } = await supabase
      .from('public_ranking')
      .insert(dataToInsert);

    if (error) {
      console.error('Erro ao exportar ranking:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao exportar ranking:', error);
    return false;
  }
}
