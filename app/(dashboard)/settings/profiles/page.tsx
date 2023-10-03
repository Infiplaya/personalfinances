import { Separator } from '@/components/ui/separator';

export default function ProfilesSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Manage Profiles</h3>
        <p className="text-muted-foreground text-sm">
          This are the settings for managing all of your profiles.
        </p>
      </div>
      <Separator />
    </div>
  );
}
