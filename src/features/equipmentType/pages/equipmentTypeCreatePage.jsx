import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EquipmentTypeForm } from "../components/equipmentTypeForm";
import { useEquipmentTypeHook } from "../hooks/useEquipmentTypeHook";

export default function EquipmentTypeCadastroPage() {
    const navigate = useNavigate();
    const { cadastro, isLoading, inputsErrors } = useEquipmentTypeHook();
    const [nome, setNome] = useState("");
    const [nota, setNota] = useState("");
    const [ativo, setAtivo] = useState(true);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const result = await cadastro({ nome, nota, ativo });
            if (!result) return;

            toast.success("Registro salvo!");
            navigate(-1);
        } catch (e) {
            const message =
                e?.response?.data?.message ??
                "Ocorreu um erro ao cadastrar o tipo de equipamento";
            toast.error(message);
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="gap-2 mb-9">
                <h3 className="text-primary/80 mb-2">Cadastrar Tipo de Equipamento</h3>
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
