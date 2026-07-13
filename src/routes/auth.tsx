import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, Mail, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — NewsMentor Daily" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && user) nav({ to: "/" });
  }, [user, loading, nav]);

  const signIn = async () => {
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg({ kind: "error", text: error.message });
    setBusy(false);
  };

  const signUp = async () => {
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) setMsg({ kind: "error", text: error.message });
    else setMsg({ kind: "info", text: "Check your inbox to confirm your email." });
    setBusy(false);
  };

  const google = async () => {
    setMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setMsg({ kind: "error", text: error.message });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-gold">NewsMentor Daily</div>
          <CardTitle className="font-serif text-3xl mt-2">Welcome</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Sign in to save streaks, plans and submissions.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={google} disabled={busy}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or email</span></div>
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-3 pt-3">
              <div className="space-y-1.5">
                <Label htmlFor="email-in">Email</Label>
                <Input id="email-in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pw-in">Password</Label>
                <Input id="pw-in" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90" onClick={signIn} disabled={busy || !email || !password}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <LogIn className="h-4 w-4 mr-1" />}
                Sign in
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-3 pt-3">
              <div className="space-y-1.5">
                <Label htmlFor="email-up">Email</Label>
                <Input id="email-up" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pw-up">Password (min 6)</Label>
                <Input id="pw-up" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={signUp} disabled={busy || !email || password.length < 6}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Mail className="h-4 w-4 mr-1" />}
                Create account
              </Button>
            </TabsContent>
          </Tabs>

          {msg && (
            <div className={`rounded-md border p-2.5 text-xs flex items-start gap-2 ${msg.kind === "error" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-gold/40 bg-gold/5 text-foreground"}`}>
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {msg.text}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
