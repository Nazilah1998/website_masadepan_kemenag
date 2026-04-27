import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export function useForgotPassword() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/update-password`
          : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo },
      );
      if (error) throw error;
      setSuccess(
        "Tautan reset password berhasil dikirim. Silakan cek email Anda.",
      );
      setEmail("");
    } catch (err) {
      setError(err?.message || "Gagal mengirim tautan reset password.");
    } finally {
      setSubmitting(false);
    }
  }

  return { email, setEmail, submitting, error, success, handleSubmit };
}
