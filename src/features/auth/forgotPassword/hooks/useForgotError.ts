import { useState, FormEvent } from "react";
import { z } from "zod";
import { FormForgotError } from "../types/FormForgotError";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
});

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({} as FormForgotError);
  const [submitLoading, setSubmitLoading] = useState(false);

  function changePassword(e?: React.SyntheticEvent) {
    if (e) e.preventDefault();

    setSubmitLoading(true);

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const issueMessage = result.error.issues[0]?.message;
      setErrors({ email: issueMessage });
      setSubmitLoading(false);
      return;
    }

    setErrors({});

    setSubmitLoading(false);
  }

  return {
    email,
    setEmail,
    errors,
    submitLoading,
    changePassword,
  };
}
