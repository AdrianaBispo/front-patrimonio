import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { CategoryForm } from "../components/CategoryForm";
import { useCategoryFormHook } from "../hooks/useCategoryFormHook";

export default function CategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [nota, setNota] = useState("");

  const {
    loadCategory,
    updateCategory,
    inputsErrors,
    isLoading,
    isLoadingData,
  } = useCategoryFormHook();

  useEffect(() => {
    if (!id) {
      navigate("/categorias", { replace: true });
      return;
    }

    loadCategory(id)
      .then((category) => {
        setNome(category.nome ?? "");
        setNota(category.nota ?? "");
        setTipo(category.tipo ?? "");
      })
      .catch((err) => {
        toast.error(t(err?.message) ?? t("errors.categoryError"));
        navigate("/categorias", { replace: true });
      });
  }, [id, loadCategory, navigate, t]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!id) return;

    try {
      const result = await updateCategory(id, {
        nome,
        tipo,
        nota,
      });

      if (!result) return;

      toast.success(t("messages.categoryUpdated"));
      navigate("/categorias");
    } catch (err) {
      toast.error(t(err?.message) ?? t("errors.categoryError"));
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className="text-primary/80 mb-2">{t("category.edit.title")}</h3>
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
