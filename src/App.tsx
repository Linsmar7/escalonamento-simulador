import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { memoryPush } from "./algorithms/memory";
import converterDadosParaGrafico from "./utils/utils";
import { Processo, TipoAlgoritmo } from "./model";
import CartaoProcesso from "./components/CartaoProcesso";
import Grafico from "./components/Grafico";
import "./App.css";

function App() {
  const [numeroProcessos, setNumeroProcessos] = useState(0);
  const [quantum, setQuantum] = useState(0);
  const [sobrecarga, setSobrecarga] = useState(0);
  const [memoriaLivre, setMemoriaLivre] = useState(0)
  const [algoritmo, setAlgoritmo] = useState<TipoAlgoritmo>(TipoAlgoritmo.fifo);
  const [btnDesativado, setBtnDesativado] = useState(true);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [dados, setDados] = useState<any>([]);
  const [grafico, setGrafico] = useState(false);
  const [animado, setAnimado] = useState(false);

  // Colocar quanto precisa no vazio.
  let memoria: any[] = [{numeroProcesso: "Vazio", paginasMemoria: memoriaLivre}]
  processos.map( e => memoryPush(e, memoria))
  let memoriaLivreObj = memoria.find((e) => e.numeroProcesso === "Vazio");

  useEffect(() => {
    const botaoDesativado =
      numeroProcessos > 0 &&
      (["fifo", "sjf"].includes(algoritmo) || (quantum > 0 && sobrecarga > 0)) &&
      !processos.find((p) => p.tempoExecucao === 0);

    setBtnDesativado(!botaoDesativado);
  }, [processos, numeroProcessos, quantum, sobrecarga, algoritmo]);

  useEffect(() => {
    const novosProcessos: Processo[] = Array.from({ length: numeroProcessos }, (_, i) => ({
      numeroProcesso: i + 1,
      tempoChegada: 0,
      tempoExecucao: 0,
      deadline: 0,
      tempoRestante: 0,
      intervalos: [],
      foraDoDeadline: false,
      tempoFinalizado: 0,
    }));
    setProcessos(novosProcessos);
  }, [numeroProcessos]);

  useEffect(() => {
    if (["fifo", "sjf"].includes(algoritmo)) {
      setQuantum(0);
      setSobrecarga(0);
    }
  }, [algoritmo]);

  const iniciar = () => {
    converterDadosParaGrafico({
      processos,
      algoritmo,
      quantum,
      sobrecarga,
      setDados,
      setGrafico,
    });
  };

  const renderizarProcessos = () => {
    return processos.map((processo, i) => (
      <CartaoProcesso
        key={i}
        processo={processo}
        setProcessos={setProcessos}
        index={i}
        tipoAlgoritmo={algoritmo}
      />
    ));
  };

  const renderizarCamposEntradaMemoria = () => (
    <>
      <TextField
        type="number"
        label="Quantum"
        value={quantum}
        onChange={(e: any) => setQuantum(e.target.value)}
        disabled={["fifo", "sjf"].includes(algoritmo)}
        style={{ marginBottom: '20px'}}
      />
      <TextField
        type="number"
        label="Sobrecarga"
        value={sobrecarga}
        onChange={(e: any) => setSobrecarga(e.target.value)}
        disabled={["fifo", "sjf"].includes(algoritmo)}
      />
    </>
  );

  return grafico ? (
    <div style={{ height: "90vh", width: "50vw" }}>
      <Grafico dados={dados} onClose={() => setGrafico(false)} animado={animado} />
    </div>
  ) : (
    <div style={{ display: 'block', padding: '50px', border: '1px solid #c891ff', borderRadius: '5px', color: 'black' }}>
      <TextField
        type="number"
        label="Quantidade de memoria livre"
        value={memoriaLivre}
        onChange={(e: any) => setMemoriaLivre(e.target.value)}
        style={{ width: '100%' }}
      />
      <div>
      {
        !!memoriaLivreObj ?
          <p>Memória livre: {memoriaLivreObj.paginasMemoria}</p> :
          <p>Sem memória livre</p>
      }

      {memoria.map((e, index) => (
        <div key={index}>
          {
            e.numeroProcesso !== "Vazio" ?
              <p>Processo: {e.numeroProcesso}, Memória livre: {e.paginasMemoria}</p> :
              ''
          }
        </div>
      ))}
      </div>
      <div>
        <Grid container spacing={1}>
          <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Switch checked={animado} onChange={() => setAnimado((prev) => !prev)} />
            <Typography>Progressão animada</Typography>
          </Grid>
          <Grid item xs={4} sm={3} style={{ display: 'flex', flexDirection: 'column' }}>
            {renderizarCamposEntradaMemoria()}
          </Grid>
          <Grid item xs={4} sm={4}>
            <TextField
              type="number"
              label="Quantidade de processos"
              value={numeroProcessos}
              onChange={(e: any) => setNumeroProcessos(e.target.value)}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={4} sm={5} style={{ marginTop: '-25px' }}>
            <InputLabel>Algoritmo</InputLabel>
            <Select
              value={algoritmo}
              onChange={(e: SelectChangeEvent<TipoAlgoritmo>) => {
                const tipo: TipoAlgoritmo = e.target.value as TipoAlgoritmo;
                setAlgoritmo(tipo)
              }}
              fullWidth
            >
              <MenuItem value="fifo">FIFO</MenuItem>
              <MenuItem value="sjf">SJF</MenuItem>
              <MenuItem value="rr">Round Robin</MenuItem>
              <MenuItem value="edf">EDF</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </div>
      <div>
        {renderizarProcessos()}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Button disabled={btnDesativado} onClick={iniciar} className="btn-iniciar">
          Iniciar
        </Button>
      </div>
    </div>
  );
}

export default App;
