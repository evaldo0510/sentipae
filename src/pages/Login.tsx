import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, HeartHandshake, ShieldCheck, Sparkles, LoaderCircle } from "lucide-react";
import { GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth } from "../services/firebase";
import { userService } from "../services/userService";
import { useAuth } from "../components/AuthProvider";
import { useSecurityAudit } from "../hooks/useSecurityAudit";

function getAuthErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === "auth/unauthorized-domain") {
    return `Este endereço ainda não está autorizado no Firebase Authentication. Solicite a inclusão de ${window.location.hostname} em Authentication → Settings → Authorized domains.`;
  }
  if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user") {
    return "A janela de autenticação foi bloqueada ou fechada. Tente novamente ou permita a abertura da janela.";
  }
  if (code === "auth/network-request-failed") {
    return "Não foi possível conectar ao serviço de autenticação. Verifique sua conexão e tente novamente.";
  }
  if (code === "auth/too-many-requests") {
    return "Muitas tentativas em sequência. Aguarde alguns minutos antes de tentar novamente.";
  }
  if (code === "auth/operation-not-allowed") {
    return "O acesso com Google ainda não está habilitado no Firebase Authentication.";
  }
  return "Não foi possível concluir seu acesso agora. Tente novamente. Se o problema continuar, fale com o suporte.";
}

export default function Login() {
  const navigate = useNavigate();
  const { user, profile, isAuthReady } = useAuth();
  const { logSecurityEvent } = useSecurityAudit();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getRedirectResult(auth).catch((redirectError) => {
      console.error("Falha ao concluir o redirecionamento do Google:", redirectError);
      setError(getAuthErrorMessage(redirectError));
    });
  }, []);

  useEffect(() => {
    if (isAuthReady && user && profile) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, profile, isAuthReady, navigate]);

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      // Mobile browsers are more reliable with the full-page redirect flow.
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      }

      const credential = await signInWithPopup(auth, provider);
      // New accounts are always created as patients. Privileged roles are assigned
      // through the platform's authorized administration flow, never by the login form.
      const syncedProfile = await userService.syncProfile(credential.user, "usuario");
      if (!syncedProfile) {
        throw new Error("Não foi possível preparar seu perfil. Tente novamente.");
      }

      try {
        await logSecurityEvent("login", "Autenticação com Google concluída.", [], "sucesso");
      } catch (auditError) {
        console.error("Falha ao registrar auditoria de login:", auditError);
      }

      navigate("/dashboard", { replace: true });
    } catch (authError) {
      const code = (authError as { code?: string })?.code;
      if (code === "auth/popup-blocked") {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectError) {
          console.error("Falha no redirecionamento do Google:", redirectError);
          setError(getAuthErrorMessage(redirectError));
          return;
        }
      }
      console.error("Falha na autenticação:", authError);
      const message = getAuthErrorMessage(authError);
      setError(message);
      try {
        await logSecurityEvent("falha_seguranca", "Falha na tentativa de autenticação.", [], "erro");
      } catch (auditError) {
        console.error("Falha ao registrar auditoria de erro:", auditError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="senti-auth-page min-h-dvh w-full px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="senti-auth-back inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            <span>Voltar</span>
          </button>
          <a href="/" className="senti-auth-brand inline-flex items-center gap-2" aria-label="SentiPae, início">
            <span className="senti-auth-mark"><HeartHandshake size={22} aria-hidden="true" /></span>
            <span className="text-lg font-bold tracking-tight">SentiPae</span>
          </a>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <section className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
              <div className="senti-auth-eyebrow mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide lg:mx-0">
                <Sparkles size={14} aria-hidden="true" />
                Cuidado que conecta pessoas
              </div>
              <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Seu espaço de cuidado começa <span className="senti-auth-highlight">aqui.</span>
              </h1>
              <p className="senti-auth-subtitle mx-auto mt-6 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0">
                Um lugar para acolher o que você sente, organizar sua jornada e encontrar apoio profissional no momento certo.
              </p>
              <div className="mt-8 hidden items-center gap-3 text-left lg:flex">
                <span className="senti-auth-trust-icon"><ShieldCheck size={20} aria-hidden="true" /></span>
                <div>
                  <p className="text-sm font-semibold">Sua jornada merece cuidado e respeito.</p>
                  <p className="senti-auth-muted text-xs">Acesso seguro à sua conta e às suas informações.</p>
                </div>
              </div>
            </motion.div>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4, delay: .05 }}
            className="senti-auth-card mx-auto w-full max-w-md rounded-[2rem] p-6 shadow-xl sm:p-9"
            aria-labelledby="login-title"
          >
            <div className="mb-8">
              <p className="senti-auth-muted mb-2 text-xs font-bold uppercase tracking-[.16em]">Bem-vindo(a)</p>
              <h2 id="login-title" className="text-2xl font-bold tracking-tight sm:text-3xl">Acesse sua conta</h2>
              <p className="senti-auth-muted mt-2 text-sm leading-relaxed">Entre para continuar de onde você parou.</p>
            </div>

            {error && (
              <div role="alert" aria-live="polite" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="senti-auth-google flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-5 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" size={20} aria-hidden="true" />
              ) : (
                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.01 13.22l7.98 6.19C11.91 13.72 17.4 9.5 24 9.5Z" transform="translate(0 5)" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.65 5.93c4.46-4.13 7.13-10.2 7.13-17.58Z" transform="translate(0 -1)" />
                  <path fill="#FBBC05" d="M10.64 28.59a14.4 14.4 0 0 1-.76-4.59c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.86.92 7.51 2.66 10.78l7.98-6.19Z" transform="translate(1)" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.65-5.93c-2.13 1.43-4.84 2.28-8.25 2.28-6.6 0-12.09-4.22-14.01-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
                </svg>
              )}
              {isSubmitting ? "Conectando com o Google..." : "Continuar com Google"}
              {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
            </button>

            <div className="my-6 flex items-center gap-3">
              <span className="senti-auth-divider h-px flex-1" />
              <span className="senti-auth-muted text-xs">Acesso protegido</span>
              <span className="senti-auth-divider h-px flex-1" />
            </div>

            <div className="senti-auth-note rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-xs leading-relaxed">
                  Seu perfil e suas permissões são definidos pela plataforma. O tipo de acesso não pode ser escolhido ou elevado pela tela de login.
                </p>
              </div>
            </div>

            <p className="senti-auth-muted mt-7 text-center text-xs leading-relaxed">
              Ao continuar, você concorda com nossos{" "}
              <a className="senti-auth-link font-semibold underline-offset-4 hover:underline" href="/termos">Termos de Uso</a>
              {" "}e{" "}
              <a className="senti-auth-link font-semibold underline-offset-4 hover:underline" href="/privacidade">Aviso de Privacidade</a>.
            </p>
            <p className="mt-5 text-center text-sm">
              <span className="senti-auth-muted">Precisa de ajuda? </span>
              <a href="/contato" className="senti-auth-link font-semibold underline-offset-4 hover:underline">Fale com o suporte</a>
            </p>
          </motion.section>
        </div>

        <footer className="senti-auth-muted pb-2 text-center text-xs">
          SentiPae · Cuidado humano, tecnologia responsável.
        </footer>
      </div>
    </main>
  );
}
