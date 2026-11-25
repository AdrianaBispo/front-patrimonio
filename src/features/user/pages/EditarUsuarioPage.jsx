import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormularioUsuario from "../components/FormularioUsuario";
import { useUsuarioFormHook } from "../hooks/useUsuarioFormHook";

function extrairRoleId(usuario, listaRoles = []) {
  if (usuario?.role_id != null && usuario.role_id !== "") {
    return String(usuario.role_id);
  }

  const rolesUsuario = usuario?.roles;

  if (Array.isArray(rolesUsuario) && rolesUsuario.length > 0) {
    const primeiro = rolesUsuario[0];

    if (primeiro != null && typeof primeiro === "object" && primeiro.id != null) {
      return String(primeiro.id);
    }

    const valor = String(primeiro);
    const porId = listaRoles.find((role) => String(role.id) === valor);
    if (porId) return String(porId.id);

    const porNome = listaRoles.find((role) => role.name === valor);
    if (porNome) return String(porNome.id);
  }

  if (typeof rolesUsuario === "string" && rolesUsuario.trim()) {
    const porNome = listaRoles.find((role) => role.name === rolesUsuario);
    if (porNome) return String(porNome.id);
  }

  return "";
}

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
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/users", { replace: true });
      return;
    }

    carregarUsuario(id)
      .then(({ usuario, roles: listaRoles }) => {
        setNome(usuario.nome ?? "");
        setCelular(usuario.celular ?? "");
        setEmail(usuario.email ?? "");
        setRoleId(extrairRoleId(usuario, listaRoles));
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
