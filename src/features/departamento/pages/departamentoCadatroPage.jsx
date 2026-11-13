import { useNavigate } from "react-router-dom";
import { FormularioDepartamento } from "../components/FormularioDepartamento";

export default function CadastrarDepartamentoPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [gestor, setGestor] = useState("");
  const [gestoresList, setGestorsList] = useState([]);
  const [nota, setNota] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputsErrors, setInputsErrors] = useState({});
  const [handleSubmit, setHandleSubmit] = useState(false);
  const [nomeList, setNomeList] = useState<Map<number, string[]>>(new Map());
  const { createGestor, getGestor, updateGestor, deleteGestor, getNomeList } = useGestorHook();

  useEffect(() => {
    const fetchNomeList = async () => {
      try {
        const result = await getNomeList();
        setNomeList(result);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchNomeList();
  }, []);



  return (
    <div className="max-w-7xl mx-auto">
      <div className="gap-2 mb-9">
        <h3 className="text-primary/80 mb-2">Cadastrar Novo Departamento</h3>
      </div>

      
      <FormularioDepartamento
        nome={nome}
        setNome={setNome}
        gestor={gestor}
        setGestor={setGestor}
        gestoresList={gestoresList}
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
