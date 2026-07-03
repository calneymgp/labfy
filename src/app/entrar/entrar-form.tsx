"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import ptBR from "react-phone-number-input/locale/pt-BR.json";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkEmailExists, requestOtp, verifyOtp } from "./actions";

type Step = "email" | "phone" | "otp";

export function EntrarForm() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState<string | undefined>();
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

    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Número de WhatsApp inválido.");
      return;
    }

    setLoading(true);
    const { error: otpError } = await requestOtp(email, phone);
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
    const { error: otpError } = await requestOtp(email, phone);
    setLoading(false);
    if (otpError) setError(otpError);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          {step === "email" && "Acesso"}
          {step === "phone" && "Novo por aqui — boas-vindas!"}
          {step === "otp" && "Confirme o código"}
        </p>
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          {step === "email" && "Entrar no Labfy"}
          {step === "phone" && "Bem-vindo(a) ao Labfy"}
          {step === "otp" && "Verifique seu e-mail"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {step === "email" && "Sem senha — enviamos um código para o seu e-mail."}
          {step === "phone" &&
            "Esse e-mail é novo por aqui. Só falta o seu WhatsApp — é a última coisa antes de criarmos sua conta."}
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
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs">
              WhatsApp
            </Label>
            <PhoneInput
              id="phone"
              flags={flags}
              labels={ptBR}
              defaultCountry="BR"
              international
              countryCallingCodeEditable={false}
              required
              autoFocus
              value={phone}
              onChange={setPhone}
              placeholder="(11) 91234-5678"
              className="labfy-phone-input"
            />
          </div>
          {error && <p className="text-xs text-exposed">{error}</p>}
          <Button type="submit" variant="outline" disabled={loading} className="w-full rounded-sm">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Finalizar cadastro"}
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
