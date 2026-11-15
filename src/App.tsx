import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PWAProvider } from "./contexts/PWAContext";
import { FeaturePreviewProvider } from "./context/FeaturePreviewContext";
import { FeaturePreviewDialog } from "./components/FeaturePreviewDialog";
const DashboardPaciente = lazy(() => import("./pages/DashboardPaciente"));
const LandingPro = lazy(() => import("./pages/LandingPro"));
const LeadForm = lazy(() => import("./pages/LeadForm"));
const VendasEmpresa = lazy(() => import("./pages/VendasEmpresa"));
const Triagem = lazy(() => import("./pages/Triagem"));
const Respiracao = lazy(() => import("./pages/Respiracao"));
const ChatIARA = lazy(() => import("./pages/ChatIARA"));
const Direcionamento = lazy(() => import("./pages/Direcionamento"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profissionais = lazy(() => import("./pages/Profissionais"));
const Agendamento = lazy(() => import("./pages/Agendamento"));
const Diario = lazy(() => import("./pages/Diario"));
const Terapeuta = lazy(() => import("./pages/Terapeuta"));
const Empresa = lazy(() => import("./pages/Empresa"));
const Prefeitura = lazy(() => import("./pages/Prefeitura"));
const Emergencia = lazy(() => import("./pages/Emergencia"));
const ProntoAtendimento = lazy(() => import("./pages/ProntoAtendimento"));
const TerapeutaSetup = lazy(() => import("./pages/TerapeutaSetup"));
const Atendimento = lazy(() => import("./pages/Atendimento"));
const Registro = lazy(() => import("./pages/Registro"));
const ProntuarioPaciente = lazy(() => import("./pages/ProntuarioPaciente"));
const TerapeutaPerfil = lazy(() => import("./pages/TerapeutaPerfil"));
const LiveIARA = lazy(() => import("./pages/LiveIARA"));
const Perfil = lazy(() => import("./pages/Perfil"));
const GerenciamentoDados = lazy(() => import("./pages/GerenciamentoDados"));
const Clinica = lazy(() => import("./pages/Clinica"));
const Hospital = lazy(() => import("./pages/Hospital"));
const Moderador = lazy(() => import("./pages/Moderador"));
const Reset = lazy(() => import("./pages/Reset"));
const Reset21 = lazy(() => import("./pages/Reset21"));
const Reset21Day = lazy(() => import("./pages/Reset21Day"));
const Reset21Sales = lazy(() => import("./pages/Reset21Sales"));
const Subscription = lazy(() => import("./pages/Subscription"));
const SimulatedCheckout = lazy(() => import("./pages/SimulatedCheckout"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Security = lazy(() => import("./pages/Security"));
const Contact = lazy(() => import("./pages/Contact"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const AppDashboard = lazy(() => import("./pages/AppDashboard"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const EspacoInspirar = lazy(() => import("./pages/EspacoInspirar"));
const DashboardInstitucional = lazy(() => import("./pages/DashboardInstitucional"));
import { TenantRoute } from "./components/TenantRoute";
import IARAChatBubble from "./components/IARAChatBubble";
import SOSButton from "./components/SOSButton";
import MobileDeviceWrapper from "./components/MobileDeviceWrapper";
import NetworkStatusIndicator from "./components/NetworkStatusIndicator";
import { ProtectedRoute, PremiumProtectedRoute } from "./components/AuthProvider";
import { AdminRoute } from "./components/AdminRoute";

import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PWAProvider>
          <FeaturePreviewProvider>
            <Router>
              <Suspense fallback={
                <div className="min-h-[40vh] w-full flex items-center justify-center p-6" role="status" aria-live="polite">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="h-9 w-9 rounded-full border-2 border-emerald-600/20 border-t-emerald-600 animate-spin" aria-hidden="true" />
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Carregando seu espaço...</span>
                  </div>
                </div>
              }>
              <Routes>
                <Route path="/" element={<LandingPro />} />
                <Route path="/checkout/simulated" element={<ProtectedRoute><SimulatedCheckout /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard defaultTab="senticore" /></AdminRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard defaultTab="geral" /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminDashboard defaultTab="usuarios" /></AdminRoute>} />
                <Route path="/admin/settings" element={<AdminRoute><AdminDashboard defaultTab="config" /></AdminRoute>} />
                <Route path="/admin/organizations" element={<AdminRoute><AdminDashboard defaultTab="organizations" /></AdminRoute>} />
                <Route path="/admin/payments" element={<AdminRoute><AdminDashboard defaultTab="financeiro" /></AdminRoute>} />
                <Route path="/reset21" element={<Reset21 />} />
                <Route path="/reset-21/day/:dayId" element={<Reset21Day />} />
                <Route path="/reset-21/sales" element={<Reset21Sales />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/seguranca" element={<Security />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/lead" element={<LeadForm />} />
                <Route path="/vendas-empresa" element={<VendasEmpresa />} />
                <Route path="/direcionamento" element={<ProtectedRoute><Direcionamento /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/terapeuta" element={<ProtectedRoute><Terapeuta /></ProtectedRoute>} />
                <Route path="/empresa" element={<ProtectedRoute><TenantRoute><Empresa /></TenantRoute></ProtectedRoute>} />
                <Route path="/prefeitura" element={<ProtectedRoute><TenantRoute><Prefeitura /></TenantRoute></ProtectedRoute>} />
                <Route path="/dashboard-institucional" element={<ProtectedRoute><TenantRoute requireAdmin><DashboardInstitucional /></TenantRoute></ProtectedRoute>} />
                <Route path="/agendamento/:id" element={<ProtectedRoute><Agendamento /></ProtectedRoute>} />
                <Route path="/terapeuta-perfil/:id" element={<ProtectedRoute><TerapeutaPerfil /></ProtectedRoute>} />
                <Route path="/gerenciar-dados" element={<ProtectedRoute><GerenciamentoDados /></ProtectedRoute>} />
                <Route path="/terapeuta-setup" element={<ProtectedRoute><TerapeutaSetup /></ProtectedRoute>} />
                <Route path="/clinica" element={<ProtectedRoute><Clinica /></ProtectedRoute>} />
                <Route path="/hospital" element={<ProtectedRoute><Hospital /></ProtectedRoute>} />
                <Route path="/moderador" element={<ProtectedRoute><Moderador /></ProtectedRoute>} />
                <Route path="/atendimento/:appointmentId" element={<ProtectedRoute><Atendimento /></ProtectedRoute>} />
                <Route path="/registro/:appointmentId" element={<ProtectedRoute><Registro /></ProtectedRoute>} />
                <Route path="/terapeuta/paciente/:id" element={<ProtectedRoute><ProntuarioPaciente /></ProtectedRoute>} />

                {/* Layout Route with Persistent Mobile Shell for Beautiful Page Transitions */}
                <Route element={<ProtectedRoute><MobileDeviceWrapper /></ProtectedRoute>}>
                  <Route path="/home" element={<PremiumProtectedRoute><DashboardPaciente /></PremiumProtectedRoute>} />
                  <Route path="/assinatura" element={<Subscription />} />
                  <Route path="/reset" element={<Reset />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/triagem" element={<Triagem />} />
                  <Route path="/respiracao" element={<PremiumProtectedRoute><Respiracao /></PremiumProtectedRoute>} />
                  <Route path="/chat" element={<PremiumProtectedRoute><ChatIARA /></PremiumProtectedRoute>} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/app" element={<AppDashboard />} />
                  <Route path="/profissionais" element={<PremiumProtectedRoute><Profissionais /></PremiumProtectedRoute>} />
                  <Route path="/diario" element={<PremiumProtectedRoute><Diario /></PremiumProtectedRoute>} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/emergencia" element={<Emergencia />} />
                  <Route path="/pronto-atendimento" element={<ProntoAtendimento />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/inspirar" element={<PremiumProtectedRoute><EspacoInspirar /></PremiumProtectedRoute>} />
                  <Route path="/live-iara" element={<LiveIARA />} />
                </Route>
              </Routes>
              </Suspense>
              <IARAChatBubble />
              <SOSButton />
              <NetworkStatusIndicator />
              <FeaturePreviewDialog />
            </Router>
          </FeaturePreviewProvider>
        </PWAProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
