import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AuthPage } from '@/pages/auth/AuthPage';
import { SeniorApp } from '@/pages/senior/SeniorApp';
import { CaregiverApp } from '@/pages/caregiver/CaregiverApp';
import { PageLoader } from '@/components/ui/Spinner';
import { ToastContainer } from '@/components/ui/Toast';
import { DemoBar } from '@/components/DemoBar';

function AppContent() {
  const { user, profile, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user || !profile) return <AuthPage />;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <DemoBar />
      <div className="flex-1 flex flex-col">
        {profile.role === 'caregiver' || profile.role === 'admin' ? (
          <CaregiverApp />
        ) : (
          <SeniorApp />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer />
    </AuthProvider>
  );
}
