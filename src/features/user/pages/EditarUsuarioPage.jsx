import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormularioUsuario from "../components/FormularioUsuario";
import { useUsuarioFormHook } from "../hooks/useUsuarioFormHook";

export default function EditarUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    carregarUsuario,
    editarUsuario,
    roles,
    isLoading,
    isLoadingData,
    inputsErrors,
  } = useUsuarioFormHook();

  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [departamentoNome, setDepartamentoNome] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/users", { replace: true });
      return;
    }

    carregarUsuario(id)
      .then((usuario) => {
        setNome(usuario.nome ?? "");
        setCelular(usuario.celular ?? "");
        setEmail(usuario.email ?? "");
        setDepartamentoId(usuario.departamento_id ?? "");
        setDepartamentoNome(usuario.departamento_name ?? "");
        setRoleId(
          usuario.roles?.[0]?.id != null
            ? String(usuario.roles[0].id)
            : "",
        );
      })
      .catch((error) => {
        toast.error(error?.message ?? "Não foi possível carregar o usuário");
        navigate("/users", { replace: true });
      });
  }, [id, carregarUsuario, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!id) return;

    try {
      const result = await editarUsuario(id, {
        nome,
        celular,
        email,
        departamento_id: departamentoId,
        role_id: roleId,
        password,
      });

      if (!result) return;
      toast.success("Usuário editado com sucesso!");
      navigate("/users");
    } catch (error) {
      toast.error(error?.message ?? "Não foi possível editar o usuário");
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
      <div className="mb-9">
        <h3 className="mb-2 text-primary/80">Editar Usuário</h3>
        <p>Atualize os dados pessoais e as credenciais do usuário.</p>
      </div>

      <FormularioUsuario
        nome={nome}
        setNome={setNome}
        celular={celular}
        setCelular={setCelular}
        email={email}
        setEmail={setEmail}
        departamentoId={departamentoId}
        setDepartamentoId={setDepartamentoId}
        departamentoNome={departamentoNome}
        roleId={roleId}
        setRoleId={setRoleId}
        password={password}
        setPassword={setPassword}
        roles={roles}
        inputsErrors={inputsErrors}
        isLoading={isLoading}
        isEditing
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
