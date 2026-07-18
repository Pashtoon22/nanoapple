import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Crown, LogOut, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — 360 Angle" }] }),
});

function DashboardPage() {
  const { user, tier, isOwner, signOut } = useAuth();

  const gens = useQuery({
    queryKey: ["myGenerations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("generations")
        .select("id, prompt, image_url, created_at")
        .order("created_at", { ascending: false })
        .limit(12);
      return data ?? [];
    },
  });

  const credits = useQuery({
    queryKey: ["myCredits", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("credits")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-[#080B14] text-white">
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
              <Sparkles className="h-4 w-4" />
            </div>
            360 Angle
          </Link>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Button asChild variant="ghost" className="text-purple-300 hover:bg-white/10">
                <Link to="/admin"><Crown className="mr-2 h-4 w-4" /> Owner</Link>
              </Button>
            )}
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link to="/generate">Generator</Link>
            </Button>
            <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold">Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}</h1>
          <p className="mt-1 text-sm text-white/60">
            {isOwner ? "You have unlimited access to every feature." : `You are on the ${tier ?? "free"} plan.`}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-xs uppercase text-white/50"><Zap className="h-4 w-4" /> Plan</div>
            <div className="mt-1 text-2xl font-bold capitalize">{isOwner ? "Owner" : tier ?? "free"}</div>
            {!isOwner && tier === "free" && (
              <Button asChild size="sm" className="mt-3 bg-gradient-to-r from-purple-500 to-indigo-600">
                <Link to="/pricing">Upgrade</Link>
              </Button>
            )}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase text-white/50">Images today</div>
            <div className="mt-1 text-2xl font-bold">
              {isOwner ? "∞" : `${credits.data?.daily_images_used ?? 0} / ${tier === "free" ? 20 : "∞"}`}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase text-white/50">Videos today</div>
            <div className="mt-1 text-2xl font-bold">
              {isOwner ? "∞" : `${credits.data?.daily_videos_used ?? 0} / ${tier === "free" ? 3 : "∞"}`}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent generations</h2>
            <Button asChild variant="ghost" className="text-white/70 hover:bg-white/10">
              <Link to="/generate">New generation</Link>
            </Button>
          </div>
          {gens.data && gens.data.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {gens.data.map((g: any) => (
                <div key={g.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  {g.image_url && <img src={g.image_url} alt={g.prompt} className="aspect-square w-full object-cover" />}
                  <div className="line-clamp-2 p-2 text-xs text-white/60">{g.prompt}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-white/40" />
              <p className="mt-2 text-sm text-white/60">No generations yet. Head to the generator.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
