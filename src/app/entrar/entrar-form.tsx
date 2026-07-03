"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkEmailExists, requestOtp, verifyOtp } from "./actions";

type Step = "email" | "phone" | "otp";

export function EntrarForm() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [ddi, setDdi] = React.useState("55");
  const [ddd, setDdd] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { exists, error: checkError } = await checkEmailExists(email);
    if (checkError) {
      setError(checkError);
      setLoading(false);
      return;
    }

    if (exists) {
      const { error: otpError } = await requestOtp(email);
      setLoading(false);
      if (otpError) return setError(otpError);
      setStep("otp");
    } else {
      setLoading(false);
      setStep("phone");
    }
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: otpError } = await requestOtp(email, { ddi, ddd, number });
    setLoading(false);
    if (otpError) return setError(otpError);
    setStep("otp");
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: verifyError } = await verifyOtp(email, code);
    setLoading(false);
    if (verifyError) return setError(verifyError);

    router.push("/");
    router.refresh();
  }

  async function handleResend() {
    setError(null);
    setLoading(true);
    const { error: otpError } = await requestOtp(email, step === "otp" && ddd ? { ddi, ddd, number } : undefined);
    setLoading(false);
    if (otpError) setError(otpError);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          {step === "email" && "Acesso"}
          {step === "phone" && "Novo por aqui"}
          {step === "otp" && "Confirme o código"}
        </p>
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          {step === "email" && "Entrar no Labfy"}
          {step === "phone" && "Um dado a mais"}
          {step === "otp" && "Verifique seu e-mail"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {step === "email" && "Sem senha — enviamos um código para o seu e-mail."}
          {step === "phone" && "Precisamos do seu WhatsApp para concluir o cadastro."}
          {step === "otp" && (
            <>
              Enviamos um código de 6 dígitos para <span className="text-foreground">{email}</span>
            </>
          )}
        </p>
      </div>

      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="rounded-sm"
            />
          </div>
          {error && <p className="text-xs text-exposed">{error}</p>}
          <Button type="submit" variant="outline" disabled={loading} className="w-full rounded-sm">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Continuar"}
            {!loading && <ArrowRight className="h-3.5 w-3.5" />}
          </Button>
        </form>
      )}

      {step === "phone" && (
        <form onSubmit={handlePhoneSubmit} className="space-y-3">
          <div className="grid grid-cols-[4.5rem_5rem_1fr] gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="ddi" className="text-xs">
                DDI
              </Label>
              <Input
                id="ddi"
                inputMode="numeric"
                required
                value={ddi}
                onChange={(e) => setDdi(e.target.value)}
                placeholder="55"
                className="rounded-sm"
              />
            </div>
            {ddi.replace(/\D/g, "") === "55" && (
              <div className="space-y-1.5">
                <Label htmlFor="ddd" className="text-xs">
                  DDD
                </Label>
                <Input
                  id="ddd"
                  inputMode="numeric"
                  required
                  value={ddd}
                  onChange={(e) => setDdd(e.target.value)}
                  placeholder="11"
                  className="rounded-sm"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="number" className="text-xs">
                Celular
              </Label>
              <Input
                id="number"
                inputMode="numeric"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="912345678"
                className="rounded-sm"
              />
            </div>
          </div>
          {error && <p className="text-xs text-exposed">{error}</p>}
          <Button type="submit" variant="outline" disabled={loading} className="w-full rounded-sm">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Continuar"}
            {!loading && <ArrowRight className="h-3.5 w-3.5" />}
          </Button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Trocar e-mail
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-xs">
              Código
            </Label>
            <Input
              id="code"
              inputMode="numeric"
              required
              autoFocus
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              className="rounded-sm text-center font-mono text-lg tracking-[0.5em]"
            />
          </div>
          {error && <p className="text-xs text-exposed">{error}</p>}
          <Button type="submit" variant="outline" disabled={loading} className="w-full rounded-sm">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirmar"}
          </Button>
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Trocar e-mail
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-muted-foreground hover:text-foreground"
            >
              Reenviar código
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
