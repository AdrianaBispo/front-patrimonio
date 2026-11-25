import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import UserForm from "../components/UserForm";
import { useUserFormHook } from "../hooks/useUserFormHook";

export default function UserCreatePage() {
  const navigate = useNavigate();
  const {
    loadRoles,
    createUser,
    roles,
    isLoading,
    isLoadingData,
    inputsErrors,
  } = useUserFormHook();

  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadRoles().catch((error) => {
      toast.error(error?.message ?? "Não foi possível carregar os perfis");
    });
  }, [loadRoles]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const result = await createUser({
        nome,
        celular,
        email,
        role_id: roleId,
        password,
      });

      if (!result) return;
      toast.success("Usuário cadastrado com sucesso!");
      navigate("/users");
    } catch (error) {
      toast.error(error?.message ?? "Não foi possível cadastrar o usuário");
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
        <h3 className="mb-2 text-primary/80">Cadastrar Novo Usuário</h3>
        <p>Informe os dados pessoais e o perfil de acesso do novo usuário.</p>
      </div>

      <UserForm
        nome={nome}
        setNome={setNome}
        celular={celular}
        setCelular={setCelular}
        email={email}
        setEmail={setEmail}
        roleId={roleId}
        setRoleId={setRoleId}
        password={password}
        setPassword={setPassword}
        roles={roles}
        inputsErrors={inputsErrors}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
