import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function mapLoginError(error) {
  const rawMessage = String(error?.message || "").toLowerCase();
  if (rawMessage.includes("invalid login credentials")) {
    return "Password salah / akun tidak ada, silahkan coba lagi.";
  }
  return error?.message || "Terjadi kesalahan saat login admin.";
}

function createSimpleCaptcha(length = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let i = 0; i < length; i += 1) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
}

export function useAdminLogin(initialUnauthorized) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState(
    initialUnauthorized
      ? "Sesi Anda tidak valid atau tidak memiliki akses admin."
      : "",
  );

  const [captchaChallenge, setCaptchaChallenge] = useState(() =>
    createSimpleCaptcha(),
  );
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    let active = true;
    async function checkSession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!active) return;
        if (!sessionError && data?.session) {
          const res = await fetch("/api/admin/session", {
            method: "GET",
            cache: "no-store",
          });
          if (!active) return;
          if (res.ok) {
            const payload = await res.json();
            if (
              payload?.ok &&
              (payload?.permissions?.isAdmin || payload?.permissions?.isEditor)
            ) {
              router.replace("/admin");
              return;
            }
          }
        }
      } catch {
        /* ignore */
      } finally {
        if (active) setLoadingSession(false);
      }
    }
    checkSession();
    return () => {
      active = false;
    };
  }, [router, supabase]);

  const handlePasswordKeyState = (event) =>
    setCapsLock(Boolean(event.getModifierState?.("CapsLock")));

  const refreshCaptcha = () => {
    setCaptchaChallenge(createSimpleCaptcha());
    setCaptchaInput("");
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setError("");

    const normalizedCaptchaInput = captchaInput.trim().toUpperCase();
    if (
      !normalizedCaptchaInput ||
      normalizedCaptchaInput !== captchaChallenge
    ) {
      setError("Captcha tidak sesuai. Silakan coba lagi.");
      refreshCaptcha();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const payload = await res.json();
      if (!res.ok || !payload?.ok) {
        setError(mapLoginError(payload));
        refreshCaptcha();
        return;
      }
      window.location.href = "/admin";
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan jaringan saat login.");
      refreshCaptcha();
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loadingSession,
    submitting,
    showPassword,
    setShowPassword,
    capsLock,
    error,
    setError,
    captchaChallenge,
    captchaInput,
    setCaptchaInput,
    handlePasswordKeyState,
    refreshCaptcha,
    handleSubmit,
  };
}
