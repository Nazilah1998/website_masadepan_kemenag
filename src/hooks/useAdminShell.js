import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export function useAdminShell() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [permissionContext, setPermissionContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const [sessionRes, permRes] = await Promise.all([
          fetch("/api/admin/session", { cache: "no-store" }),
          fetch("/api/admin/my-permissions", { cache: "no-store" }),
        ]);

        const session = await sessionRes.json().catch(() => null);
        const perm = await permRes.json().catch(() => null);

        if (!active) return;

        const hasAdminPanelAccess =
          session?.permissions?.isAdmin || session?.permissions?.isEditor;

        if (!sessionRes.ok || !hasAdminPanelAccess) {
          if (active) {
            setSessionData(null);
            setPermissionContext(null);
          }
          return;
        }

        if (active) {
          setSessionData(session);
          setPermissionContext(perm?.permissionContext || null);
        }
      } catch {
        if (active) {
          setSessionData(null);
          setPermissionContext(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSession();
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const compactName = useMemo(() => {
    const name = String(sessionData?.user?.full_name || "").trim();
    if (name) return name;
    const email = String(sessionData?.user?.email || "").trim();
    return email ? email.split("@")[0] : "Admin";
  }, [sessionData?.user]);

  return {
    sidebarOpen,
    setSidebarOpen,
    sessionData,
    permissionContext,
    loading,
    compactName,
    profile: sessionData?.user || null,
    role: sessionData?.permissions?.role || null,
  };
}
