import {
  edf,
  fifo,
  roundRobin,
  sjf,
} from "../algorithms/algorithms";
import { DadosConversao, Intervalo, Resultado } from '../model';

export default function converterDadosParaGrafico({
  processos,
  algoritmo,
  quantum,
  sobrecarga,
  setDados,
  setGrafico,
}: DadosConversao) {
  let res = null;
  let arr: Resultado[] = [];
  if (processos.find((p) => p.tempoChegada === 0) === undefined) {
    alert("Algum processo precisa chegar no tempo 0");
    processos.sort((a, b) => a.tempoChegada - b.tempoChegada)[0].tempoChegada = 0;
  }
  switch (algoritmo) {
    case "fifo":
      res = fifo(processos.sort((a, b) => a.tempoChegada - b.tempoChegada));
      arr = [];
      res.resultado.forEach((r: any) => {
        arr.push({
          numeroProcesso: r.numeroProcesso,
          resultado: Array.from(Array(r.fim).keys())
            .fill(0, 0, r.tempoChegada)
            .fill(2, r.tempoChegada, r.inicio)
            .fill(1, r.inicio, r.fim),
        });
      });
      break;
    case "sjf":
      res = sjf(processos);
      arr = [];
      res.resultado.forEach((r: any) => {
        arr.push({
          numeroProcesso: r.numeroProcesso,
          resultado: Array.from(Array(r.fim).keys())
            .fill(0, 0, r.tempoChegada)
            .fill(2, r.tempoChegada, r.inicio)
            .fill(1, r.inicio, r.fim),
        });
      });

      break;
    case "edf":
      res = edf(processos, quantum, sobrecarga);
      res.resultado.forEach((r: any) => {
        const posicoesSemMudanca: number[] = [];
        const primeiraPosicao = r.intervalos[0].inicio;
        const posicoesProcessadas: number[] = [];
        const posicoesOverload: number[] = [];
        const posicoesDeadline: number[] = [];
        const fDeadline = r.tempoChegada + r.deadline;

        r.intervalos.forEach((intervalo: Intervalo, i: number) => {
          if (i < r.intervalos.length - 1) {
            if (intervalo.fim && r.intervalos[i + 1].inicio !== intervalo.fim) {
              const diff = r.intervalos[i + 1].inicio - intervalo.fim;
              posicoesSemMudanca.push(
                ...Array.from(Array(diff).keys()).map(
                  (n) => n + (intervalo.fim !== undefined ? intervalo.fim : 0)
                )
              );
            }
          }
        });
        for (
          let i = primeiraPosicao;
          i < r.intervalos[r.intervalos.length - 1].fim;
          i++
        ) {
          if (!posicoesSemMudanca.includes(i)) {
            if (i >= fDeadline) {
              posicoesDeadline.push(i);
            } else {
              posicoesProcessadas.push(i);
            }
          }
        }

        for (let intervalo of r.intervalos) {
          if (intervalo.fim - intervalo.inicio > quantum) {
            for (let i = +intervalo.inicio + +quantum; i < +intervalo.fim; i++) {
              posicoesOverload.push(i);
            }
          }
        }

        const resultado = Array.from(
          Array(r.intervalos[r.intervalos.length - 1].fim)
        ).fill(0);

        if (r.tempoChegada < primeiraPosicao) {
          resultado.fill(2, r.tempoChegada, primeiraPosicao);
        }

        posicoesProcessadas.forEach((p: number) => {
          resultado[p] = 1;
        });
        posicoesSemMudanca.forEach((p: number) => {
          resultado[p] = 2;
        });
        posicoesDeadline.forEach((p: number) => {
          resultado[p] = 3;
        });
        posicoesOverload.forEach((p: number) => {
          resultado[p] = 4;
        });

        arr.push({
          numeroProcesso: r.numeroProcesso,
          resultado,
          deadline: fDeadline,
        });
      });
      break;
    case "rr":
      res = roundRobin(processos, quantum, sobrecarga);
      res.resultado.forEach((r: any, i: number) => {
        const posicoesSemMudanca: number[] = [];
        const primeiraPosicao = r.intervalos[0].inicio;
        const posicoesProcessadas: number[] = [];
        const posicoesOverload: number[] = [];

        r.intervalos.forEach((intervalo: Intervalo, i: number) => {
          if (i < r.intervalos.length - 1) {
            if (intervalo.fim && r.intervalos[i + 1].inicio !== intervalo.fim) {
              const diff = r.intervalos[i + 1].inicio - intervalo.fim;
              posicoesSemMudanca.push(
                ...Array.from(Array(diff).keys()).map(
                  (n) => n + (intervalo.fim !== undefined ? intervalo.fim : 0)
                )
              );
            }
          }
        });
        for (
          let i = primeiraPosicao;
          i < r.intervalos[r.intervalos.length - 1].fim;
          i++
        ) {
          if (!posicoesSemMudanca.includes(i)) {
            posicoesProcessadas.push(i);
          }
        }

        for (let intervalo of r.intervalos) {
          if (intervalo.fim - intervalo.inicio > quantum) {
            for (let i = +intervalo.inicio + +quantum; i < +intervalo.fim; i++) {
              posicoesOverload.push(i);
            }
          }
        }

        const resultado = Array.from(
          Array(r.intervalos[r.intervalos.length - 1].fim)
        ).fill(0);

        if (r.tempoChegada < primeiraPosicao) {
          resultado.fill(2, r.tempoChegada, primeiraPosicao);
        }

        posicoesProcessadas.forEach((p: number) => {
          resultado[p] = 1;
        });
        posicoesSemMudanca.forEach((p: number) => {
          resultado[p] = 2;
        });
        posicoesOverload.forEach((p: number) => {
          resultado[p] = 4;
        });
        arr.push({
          numeroProcesso: r.numeroProcesso,
          resultado,
        });
      });

      break;
  }
  setDados({
    resultado: arr,
    tempoRespostaMedio: res?.tempoExecucaoMedio || 0,
  });
  setGrafico(true);
}
