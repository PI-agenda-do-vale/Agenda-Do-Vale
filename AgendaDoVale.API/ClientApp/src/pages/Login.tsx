import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const { login, cadastro } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !senha || (mode === "cadastro" && !nome)) {
      toast.error("Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      const result =
        mode === "login"
          ? await login(email, senha)
          : await cadastro({ nome, email, senha });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(mode === "login" ? "Bem-vindo!" : "Conta criada!");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-4">
      <h1 className="text-2xl font-semibold">
        {mode === "login" ? "Login" : "Cadastro"}
      </h1>

      {mode === "cadastro" && (
        <Input
          className="max-w-sm"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      )}

      <Input
        className="max-w-sm"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        className="max-w-sm"
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      {mode === "cadastro" && (
        <p className="text-xs text-muted-foreground max-w-sm text-center">
          Mínimo 8 caracteres, com maiúscula, minúscula, número e caractere
          especial (!@#$%^&*).
        </p>
      )}

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
      </Button>

      <button
        type="button"
        className="text-sm text-muted-foreground underline"
        onClick={() => setMode(mode === "login" ? "cadastro" : "login")}
      >
        {mode === "login" ? "Criar conta" : "Já tenho conta"}
      </button>
    </div>
  );
}
