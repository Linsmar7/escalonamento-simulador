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
              setProcessos((prev: Processo[]) => {
                const prevProcessos = [...prev];
                prevProcessos[index] = {
                  ...prevProcessos[index],
                  tempoChegada: +e.target.value,
                };
                return prevProcessos;
              });
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Tempo de execução"
            value={processo.tempoExecucao}
            onChange={(e: any) => {
              setProcessos((prev: Processo[]) => {
                const prevProcessos = [...prev];
                prevProcessos[index] = {
                  ...prevProcessos[index],
                  tempoExecucao: +e.target.value,
                };
                return prevProcessos;
              });
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
                setProcessos((prev: Processo[]) => {
                  const prevProcessos = [...prev];
                  prevProcessos[index] = {
                    ...prevProcessos[index],
                    deadline: +e.target.value,
                  };
                  return prevProcessos;
                });
              }}
            />
          </Grid>
        )}
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Paginas Memoria"
            onChange={(e: any) => {
              setProcessos((prev: Processo[]) => {
                const prevProcessos = [...prev];
                prevProcessos[index] = {
                  ...prevProcessos[index],
                  paginasMemoria: +e.target.value,
                };
                return prevProcessos;
              });
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
