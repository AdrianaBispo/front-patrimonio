import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { EquipmentTypeForm } from "../components/equipmentTypeForm";
import { useEquipmentTypeHook } from "../hooks/useEquipmentTypeHook";

function extrairRegistro(result, id) {
    if (result?.data?.id != null) return result.data;
    if (result?.id != null) return result;

    const lista = Array.isArray(result?.data?.data)
        ? result.data.data
        : Array.isArray(result?.data)
            ? result.data
            : [];

    return lista.find((item) => String(item.id) === String(id)) ?? lista[0] ?? null;
}

function registroAtivo(valor) {
    return valor === true || valor === 1 || valor === "1";
}

export default function TipoEquipmentEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { editar, searchEquipmentType, isLoading, inputsErrors } = useEquipmentTypeHook();
    const [nome, setNome] = useState("");
    const [nota, setNota] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregar = async () => {
            if (!id) return;

            try {
                const result = await searchEquipmentType("", id);
                const registro = extrairRegistro(result, id);

                if (!registro) {
                    toast.error("Tipo de equipamento não encontrado");
                    navigate(-1);
                    return;
                }

                setNome(registro.nome ?? "");
                setNota(registro.nota ?? "");
                setAtivo(registroAtivo(registro.ativo));
            } catch (e) {
                toast.error(
                    e?.response?.data?.message ??
                        "Ocorreu um erro ao obter os dados"
                );
            } finally {
                setCarregando(false);
            }
        };

        carregar();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!id) return;

        try {
            const result = await editar(id, { nome, nota, ativo });
            if (!result) return;

            toast.success("Registro salvo!");
            navigate(-1);
        } catch (e) {
            toast.error(
                e?.response?.data?.message ??
                    "Ocorreu um erro ao editar o tipo de equipamento"
            );
        }
    }

    if (carregando) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="gap-2 mb-9">
                <h3 className="text-primary/80 mb-2">Editar Tipo de Equipamento</h3>
            </div>
            <EquipmentTypeForm
                nome={nome}
                setNome={setNome}
                nota={nota}
                setNota={setNota}
                ativo={ativo}
                setAtivo={setAtivo}
                isLoading={isLoading}
                inputsErrors={inputsErrors}
                handleSubmit={handleSubmit}
                navigate={navigate}
            />
        </div>
    );
}
