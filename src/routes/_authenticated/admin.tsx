import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  Users,
  Image as ImageIcon,
  Film,
  DollarSign,
  Crown,
  Shield,
  Settings as SettingsIcon,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  getAdminStats,
  listAdminUsers,
  listRecentPayments,
  setUserBanned,
  setUserTier,
} from "@/lib/admin.functions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — 360 Angle" }] }),
});

function StatCard({ icon: Icon, label, value, tint }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tint}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

function AdminPage() {
  const { isOwner, loading } = useAuth();
  const stats = useServerFn(getAdminStats);
  const users = useServerFn(listAdminUsers);
  const pays = useServerFn(listRecentPayments);
  const banFn = useServerFn(setUserBanned);
  const tierFn = useServerFn(setUserTier);

  const statsQ = useQuery({ queryKey: ["adminStats"], queryFn: () => stats(), enabled: isOwner });
  const usersQ = useQuery({ queryKey: ["adminUsers"], queryFn: () => users(), enabled: isOwner });
  const paysQ = useQuery({ queryKey: ["adminPays"], queryFn: () => pays(), enabled: isOwner });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B14] text-white">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080B14] px-4 text-white">
        <div className="max-w-sm rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
          <Shield className="mx-auto h-8 w-8 text-white/60" />
          <h1 className="mt-3 text-xl font-semibold">Owner only</h1>
          <p className="mt-2 text-sm text-white/60">This dashboard is restricted to the site owner.</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const s = statsQ.data;

  return (
    <div className="min-h-screen bg-[#080B14] text-white">
      <Toaster theme="dark" />
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-purple-400" />
            <div>
              <div className="text-lg font-semibold">Owner Dashboard</div>
              <div className="text-xs text-white/50">Complete platform control</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link to="/dashboard">User view</Link>
            </Button>
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link to="/generate">Generator</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Total users" value={s?.totalUsers ?? "—"} tint="from-purple-500 to-indigo-600" />
          <StatCard icon={ImageIcon} label="Images generated" value={s?.totalImages ?? "—"} tint="from-pink-500 to-purple-600" />
          <StatCard icon={Film} label="Videos generated" value={s?.totalVideos ?? "—"} tint="from-cyan-500 to-blue-600" />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={s ? `$${(s.revenueCents / 100).toFixed(2)}` : "—"}
            tint="from-emerald-500 to-green-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase text-white/50">Free</div>
            <div className="mt-1 text-2xl font-bold">{s?.tierCounts?.free ?? 0}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase text-white/50">Pro</div>
            <div className="mt-1 text-2xl font-bold">{s?.tierCounts?.pro ?? 0}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase text-white/50">Enterprise</div>
            <div className="mt-1 text-2xl font-bold">{s?.tierCounts?.enterprise ?? 0}</div>
          </div>
        </div>

        {/* Users */}
        <div className="rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold">User management</h2>
            <span className="text-xs text-white/50">{usersQ.data?.length ?? 0} shown</span>
          </div>
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-white/50">
                <tr>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Tier</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(usersQ.data ?? []).map((u: any) => {
                  const role = u.user_roles?.[0]?.role ?? "user";
                  const tier = u.subscriptions?.[0]?.tier ?? "free";
                  return (
                    <tr key={u.id} className="border-t border-white/5">
                      <td className="px-5 py-3">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded px-2 py-0.5 text-xs ${role === "owner" ? "bg-purple-500/20 text-purple-300" : "bg-white/10 text-white/70"}`}>
                          {role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          defaultValue={tier}
                          disabled={role === "owner"}
                          onChange={async (e) => {
                            try {
                              await tierFn({ data: { userId: u.id, tier: e.target.value as any } });
                              toast.success("Plan updated");
                            } catch (err: any) { toast.error(err.message); }
                          }}
                          className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">{u.banned ? "Banned" : "Active"}</td>
                      <td className="px-5 py-3">
                        {role !== "owner" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 border-white/15 bg-white/5 text-xs text-white hover:bg-white/10"
                            onClick={async () => {
                              try {
                                await banFn({ data: { userId: u.id, banned: !u.banned } });
                                toast.success(u.banned ? "User unbanned" : "User banned");
                                usersQ.refetch();
                              } catch (err: any) { toast.error(err.message); }
                            }}
                          >
                            {u.banned ? "Unban" : "Ban"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payments */}
        <div className="rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold">Recent payments</h2>
            <SettingsIcon className="h-4 w-4 text-white/50" />
          </div>
          <div className="max-h-[280px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-white/50">
                <tr>
                  <th className="px-5 py-3">When</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {(paysQ.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-sm text-white/50">
                      No payments yet. Connect Stripe to start collecting revenue.
                    </td>
                  </tr>
                )}
                {(paysQ.data ?? []).map((p: any) => (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="px-5 py-3">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="px-5 py-3">${(p.amount_cents / 100).toFixed(2)} {p.currency?.toUpperCase()}</td>
                    <td className="px-5 py-3">{p.status}</td>
                    <td className="px-5 py-3 text-white/70">{p.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
