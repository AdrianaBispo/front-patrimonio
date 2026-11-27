import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { CategoryForm } from "../components/CategoryForm";
import { useCategoryFormHook } from "../hooks/useCategoryFormHook";

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createCategory, inputsErrors, isLoading } = useCategoryFormHook();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [nota, setNota] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const result = await createCategory({
        nome,
        tipo,
        nota,
      });

      if (!result) return;

      toast.success(t("messages.categoryCreated"));
      navigate("/categorias");
    } catch (err) {
      toast.error(t(err?.message) ?? t("errors.categoryError"));
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className="text-primary/80 mb-2">{t("category.create.title")}</h3>
      </div>

      <CategoryForm
        nome={nome}
        setNome={setNome}
        tipo={tipo}
        setTipo={setTipo}
        nota={nota}
        setNota={setNota}
        isLoading={isLoading}
        inputsErrors={inputsErrors}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
