import { useCallback, useState } from "react";
import { z } from "zod";
import { FormForgotError } from "../types/FormForgotError";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
});

export interface ForgotCredentials {
  email?: string;
}

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({} as FormForgotError);
  const [submitLoading, setSubmitLoading] = useState(false);

  const changePassword = useCallback(
    async (e?: React.SubmitEvent<HTMLFormElement>) => {

      setSubmitLoading(true);

      const result = forgotPasswordSchema.safeParse({ email });
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!result.success) {
        setErrors({ email: result.error.issues[0]?.message });
        setSubmitLoading(false);
        return;
      }

      setErrors({});

      setSubmitLoading(false);
    },
    [],
  );

  return {
    email,
    setEmail,
    errors,
    submitLoading,
    changePassword,
  };
}
