import { useNavigate, useParams } from "react-router-dom";
import { DepartmentForm } from "../components/DepartmentForm";

export default function DepartamentoEditarCadastroPage() {
    const { id } = useParams();

    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [gestor, setGestor] = useState("");
    const [nota, setNota] = useState("");
    const { cadastro, getNomeList, isLoading, error, inputsErrors, nomeList } = useDepartmentHook();

    useEffect(() => {
        const fetchNomeList = async () => {
            try {
                await getNomeList();
            } catch (error) {
                toast.error(error);
            }
        };
        const getDepartamentoById = async () => {
            try {
                const departamento = await getDepartamentoById(id);
                setNome(departamento.data[0].nome);
                setGestor(departamento.data[0].gestor);
                setNota(departamento.data[0].nota);
            } catch (error) {
                toast.error(error);
            }
        };
        fetchNomeList();
        getDepartamentoById();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const sucesso = await editarDepartamento({
                id,
                nome,
                gestor,
                nota: nota,
            });
            toast.success("Registro salvo!");
            navigate(-1);
        } catch (e) {
            toast.error(error);
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="gap-2 mb-9">
                <h3 className="text-primary/80 mb-2">Cadastrar Novo Departamento</h3>
            </div>

            <DepartmentForm
                nome={nome}
                setNome={setNome}
                gestor={gestor}
                setGestor={setGestor}
                gestoresList={getNomeList}
                nota={nota}
                setNota={setNota}
                isLoading={isLoading}
                inputsErrors={inputsErrors}
                handleSubmit={handleSubmit}
                navigate={navigate}
            />
        </div>
    );
}
