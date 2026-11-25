import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import EditButton from "../../../shared/components/EditButton";
import ErrorDialog from "../../../shared/components/errorDialog";
import Pagination from "../../../shared/components/Pagination";
import { useEquipmentTypeHook } from "../hooks/useEquipmentTypeHook";

const paginacaoInicial = {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
};

function extrairPaginacao(result) {
    if (result?.meta && Array.isArray(result?.data)) {
        return {
            items: result.data,
            currentPage: result.meta.current_page ?? 1,
            lastPage: result.meta.last_page ?? 1,
            total: result.meta.total ?? result.data.length,
            from: result.meta.from ?? 0,
            to: result.meta.to ?? 0,
        };
    }

    const paginator = result?.data?.current_page != null ? result.data : result;
    const items = Array.isArray(paginator?.data) ? paginator.data : [];

    return {
        items,
        currentPage: paginator?.current_page ?? 1,
        lastPage: paginator?.last_page ?? 1,
        total: paginator?.total ?? items.length,
        from: paginator?.from ?? (items.length ? 1 : 0),
        to: paginator?.to ?? items.length,
    };
}

export default function EquipmentTypeListaPage() {
    const navigate = useNavigate();
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const { isLoading, desactivateEquipmentType, activateEquipmentType, searchEquipmentType } =
        useEquipmentTypeHook();
    const [listEquipmentType, setListEquipmentType] = useState([]);
    const [paginacao, setPaginacao] = useState(paginacaoInicial);
    const [valueFilter, setValueFilter] = useState("");

    const loadPage = async (filterValue, pageNumber) => {
        try {
            const result = await searchEquipmentType(filterValue, null, pageNumber);
            const pagina = extrairPaginacao(result);
            setListEquipmentType(pagina.items);
            setPaginacao(pagina);
        } catch (e) {
            const message =
                e?.response?.data?.message ??
                "Ocorreu um erro ao obter os dados";
            toast.error(message);
        }
    };

    useEffect(() => {
        loadPage("", 1);
    }, []);

    const filter = () => {
        loadPage(valueFilter, 1);
    };

    const registroAtivo = (item) =>
        item?.ativo === true || item?.ativo === 1 || item?.ativo === "1";

    const confirmarAlteracao = async () => {
        if (!itemSelecionado) return;

        const ativo = registroAtivo(itemSelecionado);

        try {
            if (ativo) {
                await desactivateEquipmentType(itemSelecionado.id);
                toast.success("Desativado com sucesso!");
            } else {
                await activateEquipmentType(itemSelecionado.id);
                toast.success("Ativado com sucesso!");
            }
            loadPage(valueFilter, paginacao.currentPage);
        } catch (error) {
            toast.error(
                error?.response?.data?.message ??
                    (ativo
                        ? "Ocorreu um erro ao desativar o tipo de equipamento"
                        : "Ocorreu um erro ao ativar o tipo de equipamento")
            );
        }

        setItemSelecionado(null);
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
                                Id
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-text-primary">
                                Nome
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border bg-white">
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-10">
                                    <div className="flex justify-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
                                    </div>
                                </td>
                            </tr>
                        ) : listEquipmentType.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-sm text-text-primary/70">
                                    Nenhum tipo de equipamento encontrado.
                                </td>
                            </tr>
                        ) : listEquipmentType.map((item) => (
                            <tr key={item.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm font-medium text-text-primary">
                                        {item.id}
                                    </div>
                                </td>

                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm text-text-primary">{item.nome}</div>
                                </td>

                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <div className="flex items-center justify-end gap-3">
                                        <EditButton onClick={() => navigate(`editar/${item.id}`)} />
                                        {registroAtivo(item) ? (
                                            <button
                                                type="button"
                                                onClick={() => setItemSelecionado(item)}
                                                title="Desativar"
                                                className="p-2 rounded-md transition-colors text-red-600 hover:bg-red-50"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-4.5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                                                    />
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setItemSelecionado(item)}
                                                title="Ativar"
                                                className="p-2 rounded-md transition-colors text-green-600 hover:bg-green-50"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-4.5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentPage={paginacao.currentPage}
                    lastPage={paginacao.lastPage}
                    total={paginacao.total}
                    from={paginacao.from}
                    to={paginacao.to}
                    isLoading={isLoading}
                    onPageChange={(page) => loadPage(valueFilter, page)}
                />
            </div>

            <ErrorDialog
                showPopUp={Boolean(itemSelecionado)}
                title={registroAtivo(itemSelecionado) ? "Desativar" : "Ativar"}
                loading={isLoading}
                message={
                    registroAtivo(itemSelecionado)
                        ? "Tem certeza que deseja desativar este tipo de equipamento?"
                        : "Tem certeza que deseja ativar este tipo de equipamento?"
                }
                onConfirm={confirmarAlteracao}
                onClose={() => setItemSelecionado(null)}
            />
        </div>
    );
}
