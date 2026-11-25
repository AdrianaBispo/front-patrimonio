import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useRoleHook } from "../hooks/useRoleHook";

export default function RolesEditarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    buscarPermissoesRole,
    atualizarRole,
    isLoading: isSaving,
    isLoadingData,
  } = useRoleHook();

  const [nome, setNome] = useState("");
  const [permissoes, setPermissoes] = useState([]);
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState([]);

  useEffect(() => {
    if (!id) {
      navigate("/roles", { replace: true });
      return;
    }

    buscarPermissoesRole(id)
      .then((resposta) => {
        setNome(resposta?.role?.name ?? "");

        const lista = Array.isArray(resposta?.permissions)
          ? resposta.permissions
          : [];

        setPermissoes(lista);
        setPermissoesSelecionadas(
          lista
            .filter((item) => item.assigned)
            .map((item) => Number(item.id)),
        );
      })
      .catch((error) => {
        toast.error(
          error?.message ?? "Não foi possível carregar o perfil de acesso",
        );
        navigate("/roles", { replace: true });
      });
  }, [id, buscarPermissoesRole, navigate]);

  function togglePermissao(permissionId) {
    const valor = Number(permissionId);
    setPermissoesSelecionadas((atual) =>
      atual.includes(valor)
        ? atual.filter((item) => item !== valor)
        : [...atual, valor],
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!id) return;

    if (permissoesSelecionadas.length === 0) {
      toast.error("Selecione ao menos uma permissão");
      return;
    }

    try {
      const resposta = await atualizarRole(id, {
        permissions: permissoesSelecionadas,
      });

      toast.success(resposta?.message ?? "Perfil atualizado com sucesso");
      navigate("/roles");
    } catch (error) {
      toast.error(
        error?.message ?? "Não foi possível atualizar o perfil de acesso",
      );
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
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 gap-2">
        <h3 className="mb-2 text-primary/80">Editar Perfil de Acesso</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card overflow-hidden bg-bg-secondary px-4 py-3">
          <div className="mb-5 flex flex-col gap-5 md:flex-row">
            <div className="flex-1">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                className="input-utilities"
                type="text"
                value={nome}
                disabled
                readOnly
              />
            </div>
          </div>

          <div className="mb-2">
            <h4 className="mb-3 font-bold">Permissões</h4>

            {permissoes.length === 0 ? (
              <p className="text-sm text-text-primary/70">
                Nenhuma permissão disponível.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {permissoes.map((permissao) => {
                  const permissionId = Number(permissao.id);
                  const checked = permissoesSelecionadas.includes(permissionId);

                  return (
                    <label
                      key={permissao.id}
                      htmlFor={`permissao-edit-${permissao.id}`}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-white px-3 py-2"
                    >
                      <input
                        id={`permissao-edit-${permissao.id}`}
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={checked}
                        onChange={() => togglePermissao(permissionId)}
                      />
                      <span className="text-sm text-text-primary">
                        {permissao.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-row justify-end gap-3">
          <button
            type="button"
            className="btn-secondary items-stretch"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-primary bg-primary px-8"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
              </div>
            ) : (
              "Salvar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
