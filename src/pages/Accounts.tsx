import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, UserX } from "lucide-react";
import { format } from "date-fns";

interface Profile {
  id: string;
  display_name: string;
  role: string;
  created_at: string;
  user_id: string;
  status: string;
}

interface Couple {
  couple_id: string;
  created_at: string;
  husband_name: string;
  wife_name: string;
  husband_user_id: string;
  wife_user_id: string;
}

const Accounts = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [couples, setCouples] = useState<Couple[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get all profiles with their pairing status
      const { data: profilesData } = await supabase.rpc('get_profiles_with_status' as any, {});
      
      // Fallback if RPC doesn't exist - query directly
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: allCouples } = await supabase
        .from('couples')
        .select('*')
        .eq('is_active', true);

      // Determine status for each profile
      const profilesWithStatus = allProfiles?.map(profile => {
        const isPaired = allCouples?.some(
          couple => couple.husband_id === profile.id || couple.wife_id === profile.id
        );
        return {
          ...profile,
          status: isPaired ? 'Paired' : 'Solo'
        };
      }) || [];

      setProfiles(profilesWithStatus);

      // Get couple details
      const couplesWithNames = await Promise.all(
        (allCouples || []).map(async (couple) => {
          const { data: husband } = await supabase
            .from('profiles')
            .select('display_name, user_id')
            .eq('id', couple.husband_id)
            .single();

          const { data: wife } = await supabase
            .from('profiles')
            .select('display_name, user_id')
            .eq('id', couple.wife_id)
            .single();

          return {
            couple_id: couple.id,
            created_at: couple.created_at,
            husband_name: husband?.display_name || 'Unknown',
            wife_name: wife?.display_name || 'Unknown',
            husband_user_id: husband?.user_id || '',
            wife_user_id: wife?.user_id || ''
          };
        })
      );

      setCouples(couplesWithNames);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const soloProfiles = profiles.filter(p => p.status === 'Solo');
  const pairedProfiles = profiles.filter(p => p.status === 'Paired');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--gradient-canva-bg)" }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ background: "var(--gradient-canva-bg)" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Admin - Accounts Overview</h1>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profiles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paired Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{pairedProfiles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Solo Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{soloProfiles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Couples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{couples.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Couples Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Couples
            </CardTitle>
            <CardDescription>Accounts that have successfully paired</CardDescription>
          </CardHeader>
          <CardContent>
            {couples.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No couples found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Husband</TableHead>
                    <TableHead>Wife</TableHead>
                    <TableHead>Paired Date</TableHead>
                    <TableHead>Couple ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {couples.map((couple) => (
                    <TableRow key={couple.couple_id}>
                      <TableCell className="font-medium">{couple.husband_name}</TableCell>
                      <TableCell className="font-medium">{couple.wife_name}</TableCell>
                      <TableCell>{format(new Date(couple.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{couple.couple_id.slice(0, 8)}...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Solo Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-orange-600" />
              Solo Accounts (Not Paired)
            </CardTitle>
            <CardDescription>Accounts that haven't invited their partner yet</CardDescription>
          </CardHeader>
          <CardContent>
            {soloProfiles.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">All accounts are paired!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>User ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {soloProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.display_name}</TableCell>
                      <TableCell>
                        <Badge variant={profile.role === 'husband' ? 'default' : 'secondary'}>
                          {profile.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(profile.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          Solo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{profile.user_id.slice(0, 8)}...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* All Profiles Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Profiles</CardTitle>
            <CardDescription>Complete list of all registered accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Profile ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.display_name}</TableCell>
                    <TableCell>
                      <Badge variant={profile.role === 'husband' ? 'default' : 'secondary'}>
                        {profile.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={profile.status === 'Paired' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                        }
                      >
                        {profile.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(profile.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{profile.id.slice(0, 8)}...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accounts;
