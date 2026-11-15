import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../components/AuthProvider";
import { userService } from "../services/userService";
import { 
  HeartPulse, 
  BrainCircuit, 
  Users, 
  Compass, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Check
} from "lucide-react";
import { cn } from "../lib/utils";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, profile, isAuthReady } = useAuth();
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (isAuthReady && !user) {
      navigate("/login", { replace: true });
      return;
    }
    if (isAuthReady && profile?.onboardingCompleted) {
      navigate("/app", { replace: true });
    }
  }, [isAuthReady, profile, navigate]);

  const objectives = [
    { 
      id: "conversar_ia", 
      label: "Conversar com a IA", 
      desc: "Acolhimento imediato e escuta sem julgamentos 24/7 com a IARA.", 
      icon: BrainCircuit,
      bgColor: "from-emerald-500/10 to-teal-500/5",
      borderColor: "border-emerald-500/20",
      accentColor: "text-emerald-500 bg-emerald-500/10"
    },
    { 
      id: "encontrar_terapeuta", 
      label: "Encontrar um terapeuta", 
      desc: "Sessões estruturadas e teleconsultas com psicólogos clínicos qualificados.", 
      icon: Users,
      bgColor: "from-indigo-500/10 to-purple-500/5",
      borderColor: "border-indigo-500/20",
      accentColor: "text-indigo-500 bg-indigo-500/10"
    },
    { 
      id: "autoconhecimento", 
      label: "Desenvolver autoconhecimento", 
      desc: "Diários, reflexões diárias, desafios guiados e controle de emoções.", 
      icon: Compass,
      bgColor: "from-amber-500/10 to-orange-500/5",
      borderColor: "border-amber-500/20",
      accentColor: "text-amber-500 bg-amber-500/10"
    },
    { 
      id: "evolucao_emocional", 
      label: "Acompanhar minha evolução emocional", 
      desc: "Mapeamento diário de humor, sono, atividades físicas e hábitos saudáveis.", 
      icon: TrendingUp,
      bgColor: "from-rose-500/10 to-pink-500/5",
      borderColor: "border-rose-500/20",
      accentColor: "text-rose-500 bg-rose-500/10"
    },
  ];

  const handleConfirm = async () => {
    if (!selectedObjective || !user) return;
    setSaving(true);
    setSaveError("");

    try {
      const updatedFields = {
        onboardingCompleted: true,
        preferredService: selectedObjective,
        lastAccess: new Date().toISOString()
      };

      await userService.updateProfile(user.uid, updatedFields);
      
      // Redirect to internal application home / app dashboard
      navigate("/app");
    } catch (err) {
      console.error("Error saving onboarding selection:", err);
      setSaveError("Não conseguimos salvar sua escolha agora. Verifique sua conexão e tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-dvh bg-[var(--senti-app-bg)] text-[var(--senti-text)] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[var(--senti-muted)]">Preparando seu espaço...</p>
      </div>
    );
  }

  const welcomeName = profile?.nome || user?.displayName || "Usuário";

  return (
    <div className="min-h-dvh bg-[var(--senti-app-bg)] text-[var(--senti-text)] flex flex-col justify-between p-4 sm:p-6 transition-colors font-sans">
      
      {/* Top Header Decorator */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center border border-emerald-500/20">
          <HeartPulse className="w-5 h-5 text-emerald-500 animate-pulse" />
        </div>
        <span className="text-sm font-bold tracking-wider font-serif italic text-[var(--senti-text)]">
          SentiPae
        </span>
      </div>

      {/* Main Content Card */}
      <main className="max-w-md w-full mx-auto my-auto py-6 space-y-6">
        
        {/* Welcome & Intro */}
        <div className="text-center space-y-2.5 px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Primeiro Acesso</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--senti-text)] leading-tight">
            Bem-vindo ao SentiPae, {welcomeName}!
          </h2>
          <p className="text-sm sm:text-base text-[var(--senti-muted)] leading-relaxed max-w-sm mx-auto">
            Vamos personalizar sua jornada de regulação e acolhimento. Qual é o seu objetivo principal hoje?
          </p>
        </div>

        {/* Objectives Option List */}
        <div className="space-y-3">
          {objectives.map((obj) => {
            const Icon = obj.icon;
            const isSelected = selectedObjective === obj.id;
            return (
              <button
                key={obj.id}
                onClick={() => setSelectedObjective(obj.id)}
                className={cn(
                  "w-full min-h-[84px] p-4 rounded-3xl border text-left flex items-start gap-4 transition-all duration-200 relative overflow-hidden group cursor-pointer active:scale-[0.99] select-none bg-gradient-to-br focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
                  isSelected 
                    ? "from-emerald-500/10 to-emerald-500/5 border-emerald-500/40 text-slate-900 dark:text-slate-100 shadow-sm" 
                    : "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/1"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-2xl mt-0.5 transition-transform duration-300 group-hover:scale-105",
                  isSelected ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : obj.accentColor
                )}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1 z-10 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold tracking-tight">{obj.label}</p>
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0"
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--senti-muted)] leading-relaxed pr-4">{obj.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {saveError && (
          <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
            {saveError}
          </p>
        )}

        {/* Proceed Action Button */}
        <div className="px-1">
          <button
            disabled={!selectedObjective || saving}
            onClick={handleConfirm}
            className={cn(
              "w-full min-h-14 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
              selectedObjective 
                ? "bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98" 
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            )}
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Iniciar Jornada Personalizada</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="text-center pb-2">
        <p className="text-xs text-[var(--senti-muted)] font-semibold uppercase tracking-widest">
          SentiPae — Espaço Seguro & Confidencial
        </p>
      </footer>

    </div>
  );
}
