import { ReactNode } from 'react';
import { SettingsNav } from './settings-nav';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <SettingsNav />
      <div className="mt-6">{children}</div>
    </main>
  );
}
