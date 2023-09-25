import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getCurrentProfile, getUserProfiles } from '@/db/queries/auth';
import { getCurrencies, getCurrentCurrency } from '@/db/queries/currencies';
import { NewProfileForm } from './new-profile-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileButton } from './profile-button';

export async function SelectProfile() {
  const userProfiles = await getUserProfiles();
  const currencies = await getCurrencies();
  const currentCurrency = await getCurrentCurrency();
  const currentProfile = await getCurrentProfile();

  return (
    <DialogContent>
      <Tabs defaultValue="switch" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="switch">Switch Profile</TabsTrigger>
          <TabsTrigger value="new">New Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="switch">
          <Card>
            <CardHeader>
              <CardTitle>Switch Profile</CardTitle>
              <CardDescription>Switch to other profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-x-6 space-y-2">
              {userProfiles.map((profile) => (
                <ProfileButton
                  key={profile.id}
                  profile={profile}
                  currentProfile={currentProfile}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="new">
          <Card>
            <CardContent className="space-y-2">
              <NewProfileForm
                currencies={currencies}
                currentCurrency={currentCurrency}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
