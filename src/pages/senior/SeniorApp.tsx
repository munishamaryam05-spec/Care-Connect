import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { SeniorNav } from '@/components/SeniorNav';
import { HomePage } from './HomePage';
import { AssistantPage } from './AssistantPage';
import { HealthPage } from './HealthPage';
import { RequestsPage } from './RequestsPage';

type Tab = 'home' | 'chat' | 'health' | 'requests';

export function SeniorApp() {
  const { language } = useAuth();
  const [tab, setTab] = useState<Tab>('home');

  return (
    <div className="max-w-lg mx-auto relative">
      {tab === 'home' && <HomePage onRequestHelp={() => setTab('requests')} />}
      {tab === 'chat' && <AssistantPage />}
      {tab === 'health' && <HealthPage />}
      {tab === 'requests' && <RequestsPage />}
      <SeniorNav active={tab} onChange={setTab} lang={language} />
    </div>
  );
}
