import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, User, ShieldCheck, UserPlus, ArrowRight, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"vendedor" | "admin">("vendedor");
  const [, navigate] = useLocation();
  const { signIn, signUp, setCasualAccess } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Preencha todos os campos");
        return;
      }

      const { error } = await signIn(email, password);
      if (error) {
        setError("Email ou senha incorretos");
        toast.error("Falha na autenticação");
      } else {
        toast.success("Bem-vindo de volta!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar entrar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Preencha todos os campos");
        return;
      }

      if (password.length < 6) {
        setError("Senha deve ter no mínimo 6 caracteres");
        return;
      }

      const { error } = await signUp(email, password, selectedRole);
      if (error) {
        setError("Erro ao criar conta. Email pode já estar registrado.");
        toast.error("Falha ao criar conta");
      } else {
        toast.success("Conta criada com sucesso! Verifique seu email.");
        setIsSignUp(false);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar criar a conta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCasualAccess = () => {
    setCasualAccess();
    toast.success("Acesso casual liberado");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4">
              <span className="text-3xl">🎰</span>
            </div>
            <h1 className="font-black text-3xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">
              LOTO MASTER
            </h1>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">
              Sistema de Gerenciamento de Bolões
            </p>
          </div>

          {/* Conteúdo Principal */}
          {!isSignUp ? (
            <div className="space-y-6">
              {/* Acesso Casual */}
              <Button
                onClick={handleCasualAccess}
                className="w-full border-2 border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-black py-6 flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-black text-sm">ACESSO CASUAL</div>
                    <div className="text-[10px] font-medium opacity-70">Sem login</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-bold">Ou entre como profissional</span>
                </div>
              </div>

              {/* Formulário de Login */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-black text-gray-700 uppercase">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs font-black text-gray-700 uppercase">
                    Senha
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 font-medium"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-xs text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-black py-3 rounded-lg shadow-lg disabled:opacity-50"
                >
                  {isLoading ? "Entrando..." : "ENTRAR"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-xs text-gray-600 mb-3">Não tem conta?</p>
                <Button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                    setEmail("");
                    setPassword("");
                  }}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 font-bold hover:bg-blue-50"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  CRIAR CONTA
                </Button>
              </div>
            </div>
          ) : (
            /* Formulário de Cadastro */
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-700 uppercase block">Tipo de Conta</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "vendedor", label: "Vendedor", icon: Lock },
                    { value: "admin", label: "Admin", icon: ShieldCheck },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedRole(value as "vendedor" | "admin")}
                      className={`p-3 rounded-lg border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        selectedRole === value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-xs font-black text-gray-700 uppercase">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-xs font-black text-gray-700 uppercase">
                    Senha (mínimo 6 caracteres)
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Crie uma senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 font-medium"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-xs text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-black py-3 rounded-lg shadow-lg disabled:opacity-50"
                >
                  {isLoading ? "Criando..." : "CRIAR CONTA"}
                </Button>
              </form>

              <Button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError("");
                  setEmail("");
                  setPassword("");
                }}
                variant="outline"
                className="w-full border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
              >
                ← VOLTAR
              </Button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-[10px] text-gray-500 text-center font-bold uppercase">
              © 2026 LOTO MASTER - Todos os direitos reservados
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
