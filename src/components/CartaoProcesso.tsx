import { Grid, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Processo, TipoAlgoritmo } from "../model";

interface Props {
  processo: Processo;
  setProcessos: Dispatch<SetStateAction<Processo[]>>;
  index: number;
  tipoAlgoritmo: TipoAlgoritmo;
}

export default function CartaoProcesso({
  processo,
  setProcessos,
  index,
  tipoAlgoritmo,
}: Props) {
  return (
    <div>
      <h2>Processo {processo.numeroProcesso}</h2>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Tempo de chegada"
            value={processo.tempoChegada}
            onChange={(e: any) => {
              setProcessos((prev: Processo[]) => [
                ...prev.filter((_, i) => i !== index),
                {
                  ...prev[index],
                  tempoChegada: +e.target.value,
                },
              ]);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Tempo de execução"
            value={processo.tempoExecucao}
            onChange={(e: any) => {
              setProcessos((prev: Processo[]) => [
                ...prev.filter((_, i) => i !== index),
                {
                  ...prev[index],
                  tempoExecucao: +e.target.value,
                },
              ]);
            }}
          />
        </Grid>
        {tipoAlgoritmo === 'edf' && (
          <Grid item xs={4}>
            <TextField
              type="number"
              label="Deadline"
              value={processo.deadline}
              onChange={(e: any) => {
                setProcessos((prev: Processo[]) => [
                  ...prev.filter((_, i) => i !== index),
                  {
                    ...prev[index],
                    deadline: +e.target.value,
                  },
                ]);
              }}
            />
          </Grid>
        )}
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Paginas Memoria"
            onChange={(e: any) => {
              setProcessos((prev: Processo[]) => [
                ...prev.filter((_, i) => i !== index),
                {
                  ...prev[index],
                  paginasMemoria: +e.target.value,
                },
              ]);
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
