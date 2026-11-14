import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";

import EditButton from "../../../shared/components/EditButton";
import DeleteButton from "../../../shared/components/DeleteButton";
import ErroDialogo from "../../../shared/components/ErroDialogo";
import { useTipoEquipamentoHook } from "../hooks/tipoEquipamentoHook";

export default function TipoEquipamentoListaPage() {
    const navigate = useNavigate();
    const [showPopUp, setShowPopUp] = useState(false);
    const { getTipoEquipamento, error, isLoading, deactivateTipoEquipamento, searchTipoEquipamento } =
        useTipoEquipamentoHook();
    const [listTipoEquipamento, setListTipoEquipamento] = useState([]);

    const [valueFilter, setValueFilter] = useState("");

    useEffect(() => {
        const fetchRegisters = async () => {
            try {
                const result = await getTipoEquipamento();
                setListTipoEquipamento(result);
            } catch (e) {
                toast.error(error);
            }
        };

        fetchRegisters();
    }, []);

    const filter = async () => {
        try {
            const result = await searchTipoEquipamento(valueFilterTipoEquipamento);
            setValueFilterTipoEquipamento(result);
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="gap-2 mb-9 flex justify-between">
                <h3 className=" text-primary/80 mb-2">Tipo de Equipamentos</h3>
                <button
                    className="flex justify-center gap-2 items-center rounded-md bg-primary px-8 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary/65"
                    onClick={() => navigate("cadastrar")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        class="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    Adicionar
                </button>
            </div>

            {/* Table */}

            <div className="overflow-hidden  border-border rounded-2xl shadow-md">
                {/* Pesquisa */}

                <div className="bg-bg-secondary r-50 px-3 py-3">
                    <div className="relative w-full max-w-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>

                        <input
                            type="text"
                            placeholder="Pesquisar ..."
                            class="px-1.5"
                            className="input-utilities w-full pl-10 pr-2 py-2 bg-bg-primary"
                            onChange={(e) => setValueFilter(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    filter();
                                }
                            }}

                        />
                    </div>
                </div>

                <table className="min-w-full divide-y divide-border justify-around">
                    <thead className=" text-center text-xs font-medium tracking-wider text-text-primary">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                                Nome
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                                Tipo
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border bg-white">
                        {listTipoEquipamento.map((item) => (
                            <tr key={item.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm font-medium text-text-primary">
                                        {item.nome}
                                    </div>
                                </td>

                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm text-text-primary">{item.nome}</div>
                                </td>

                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <div className="flex items-center justify-end gap-3">
                                        <EditButton onClick={() => navigate(`editar/${item.id}`)} />
                                        <DeleteButton onClick={() => setShowPopUp(true)} />
                                        <ErroDialogo
                                            showPopUp={showPopUp}
                                            titulo="Desativar "
                                            isLoading={isLoading}
                                            mensagem={
                                                <>
                                                    Tem certeza que deseja desativar este tipo de equipamento?
                                                    <br />
                                                    Essa ação não poderá ser desfeita.
                                                </>
                                            }
                                            confirmarDialogo={async () => {
                                                try {
                                                    await deactivateTipoEquipamento(item.id);
                                                    toast.success("Desativado com sucesso!");
                                                } catch (error) {
                                                    toast.error(error);
                                                }
                                                setShowPopUp(false);
                                            }}
                                            fecharDialogo={() => setShowPopUp(false)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
