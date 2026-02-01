import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

/**
 * Design: Minimalismo Moderno com Foco em Dados
 * - Cards com informações estruturadas
 * - Cores: roxo primário, verde-esmeralda para destaques
 * - Layout limpo e profissional
 */

export default function Information() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Título */}
      <div>
        <h2 className="text-3xl font-display text-foreground mb-2">
          Informações do Bolão
        </h2>
        <p className="text-muted-foreground">
          Regras, premiação e detalhes do sorteio
        </p>
      </div>

      {/* Data do Sorteio */}
      <Card className="p-6 border-0 shadow-md">
        <h3 className="text-lg font-display text-foreground mb-2">
          Data do Sorteio
        </h3>
        <p className="text-muted-foreground">
          A data e hora do sorteio serão definidas pelo administrador do bolão.
        </p>
        <div className="mt-4 p-4 bg-primary/10 rounded-md">
          <p className="text-sm font-medium text-primary">
            Sorteio: A definir
          </p>
        </div>
      </Card>

      {/* Regras */}
      <Card className="p-6 border-0 shadow-md">
        <h3 className="text-lg font-display text-foreground mb-4">
          Regras do Bolão
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                Seleção de Números
              </p>
              <p className="text-sm text-muted-foreground">
                Cada apostador deve selecionar exatamente 10 números de 01 a 25.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                Sorteio Oficial
              </p>
              <p className="text-sm text-muted-foreground">
                Serão sorteados 15 números de 01 a 25 como resultado oficial.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                Pontuação
              </p>
              <p className="text-sm text-muted-foreground">
                A pontuação é calculada pelo número de acertos entre os números
                selecionados e os números sorteados.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                Um Sorteio por Bolão
              </p>
              <p className="text-sm text-muted-foreground">
                Cada bolão possui apenas um sorteio ativo. Após o sorteio, as
                apostas permanecem para conferência e geração de PDF.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                Link Público
              </p>
              <p className="text-sm text-muted-foreground">
                Após o sorteio, um link público pode ser gerado para que os
                clientes visualizem os resultados (somente leitura).
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Premiação */}
      <Card className="p-6 border-0 shadow-md">
        <h3 className="text-lg font-display text-foreground mb-4">
          Tabela de Premiação
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="text-left py-3 px-4 font-display text-primary">
                  Acertos
                </th>
                <th className="text-left py-3 px-4 font-display text-primary">
                  Prêmio
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { hits: 10, prize: "Prêmio Máximo" },
                { hits: 9, prize: "Segundo Prêmio" },
                { hits: 8, prize: "Terceiro Prêmio" },
                { hits: 7, prize: "Quarto Prêmio" },
                { hits: 6, prize: "Quinto Prêmio" },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full font-display text-sm">
                      {row.hits}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    {row.prize}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          * A premiação é definida pelo administrador do bolão e pode variar
          conforme as regras específicas do sorteio.
        </p>
      </Card>

      {/* PDF */}
      <Card className="p-6 border-0 shadow-md bg-accent/5">
        <h3 className="text-lg font-display text-foreground mb-2">
          Resultado Oficial em PDF
        </h3>
        <p className="text-muted-foreground">
          Após o sorteio, um PDF com o resultado oficial pode ser gerado e
          compartilhado. O PDF inclui:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-accent font-bold">•</span>
            <span>Números sorteados em destaque</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">•</span>
            <span>Tabela completa de apostas com acertos destacados</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">•</span>
            <span>Pontuação de cada apostador</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">•</span>
            <span>Tabela de premiação</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">•</span>
            <span>Data e hora do sorteio</span>
          </li>
        </ul>
      </Card>

      {/* Suporte */}
      <Card className="p-6 border-0 shadow-md">
        <h3 className="text-lg font-display text-foreground mb-2">
          Dúvidas?
        </h3>
        <p className="text-muted-foreground">
          Entre em contato com o administrador do bolão para esclarecimentos
          sobre as regras, premiação ou qualquer outra dúvida.
        </p>
      </Card>
    </div>
  );
}
