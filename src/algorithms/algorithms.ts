import { Processo } from "../model";

export function fifo(processos: Processo[]) {
  const fila = [];
  let tempo = 0;
  let resultado = [];
  let contadorProcesso = 0;

  while (contadorProcesso < processos.length || fila.length > 0) {
    if (
      contadorProcesso < processos.length &&
      processos[contadorProcesso].tempoChegada <= tempo
    ) {
      fila.push(processos[contadorProcesso]);
      contadorProcesso++;
    }

    if (fila.length > 0) {
      const processo = fila.shift();

      if (!processo) {
        continue;
      }

      const tempoEspera = tempo - processo.tempoChegada;

      resultado.push({
        numeroProcesso: +processo.numeroProcesso,
        inicio: +tempo,
        fim: +tempo + +processo.tempoExecucao,
        tempoExecucaoTotal: +processo.tempoExecucao + tempoEspera,
        tempoEspera: +tempoEspera,
        tempoChegada: +processo.tempoChegada,
      });

      tempo += +processo.tempoExecucao;
    } else {
      tempo = +processos[contadorProcesso].tempoChegada;
    }
  }

  resultado = resultado.sort((a, b) => a.numeroProcesso - b.numeroProcesso);

  const tempoExecucaoTotal = resultado.reduce(
    (acc, curr) => acc + curr.tempoExecucaoTotal,
    0
  );

  const tempoExecucaoMedio = tempoExecucaoTotal / processos.length;

  return { resultado, tempoExecucaoMedio };
}

export function sjf(processos: Processo[]) {
  const fila = [];
  let tempo = 0;
  let resultado = [];
  let contadorProcesso = 0;

  while (contadorProcesso < processos.length || fila.length > 0) {
    while (
      contadorProcesso < processos.length &&
      processos[contadorProcesso].tempoChegada <= tempo
    ) {
      fila.push(processos[contadorProcesso]);
      contadorProcesso++;
    }

    fila.sort((a, b) => a.tempoExecucao - b.tempoExecucao);

    if (fila.length > 0) {
      const processo = fila.shift();

      if (!processo) {
        continue;
      }

      let tempoEspera = tempo - processo.tempoChegada;

      resultado.push({
        numeroProcesso: +processo.numeroProcesso,
        inicio: +tempo,
        fim: +tempo + +processo.tempoExecucao,
        tempoExecucaoTotal: +processo.tempoExecucao + tempoEspera,
        tempoEspera: +tempoEspera,
        tempoChegada: +processo.tempoChegada,
      });

      tempo += +processo.tempoExecucao;
    } else {
      tempo = +processos[contadorProcesso].tempoChegada;
    }
  }

  resultado = resultado.sort((a, b) => a.numeroProcesso - b.numeroProcesso);

  const tempoExecucaoTotal = resultado.reduce(
    (acc, curr) => acc + curr.tempoExecucaoTotal,
    0
  );

  const tempoExecucaoMedio = tempoExecucaoTotal / processos.length;

  return { resultado, tempoExecucaoMedio };
}

export function edf(
  processosEntrada: Processo[],
  quantum: number,
  sobrecarga: number
) {
  const fila: Processo[] = [];
  let tempo = 0;
  const resultado: Processo[] = [];
  let processoExecutando: Processo | undefined = undefined;
  let quantumRestante = quantum;
  let sobrecargaRestante = sobrecarga;

  const processos = [...processosEntrada];
  processos.sort((a, b) => a.tempoChegada - b.tempoChegada);

  while (processoExecutando || processos.length > 0 || fila.length > 0) {
    while (processos.length > 0 && processos[0].tempoChegada == tempo) {
      const processoParaEntrarNaFila = processos.shift()!;
      processoParaEntrarNaFila.tempoRestante = processoParaEntrarNaFila.tempoExecucao;
      processoParaEntrarNaFila.intervalos = [];
      fila.push(processoParaEntrarNaFila);

      fila.sort(
        (a, b) =>
          a.tempoChegada + a.deadline - (b.tempoChegada + b.deadline)
      );
    }

    if (
      processoExecutando &&
      (processoExecutando.tempoRestante === 0 ||
        (quantumRestante === 0 && sobrecargaRestante === 0))
    ) {
      quantumRestante = quantum;
      sobrecargaRestante = sobrecarga;

      const intervalo = processoExecutando.intervalos.pop();
      processoExecutando.intervalos.push({
        inicio: intervalo!.inicio,
        fim: tempo,
      });

      if (processoExecutando.tempoRestante === 0) {
        processoExecutando.tempoFinalizado = tempo;
        processoExecutando.foraDoDeadline =
          processoExecutando.tempoChegada + processoExecutando.deadline < tempo
            ? true
            : false;

        resultado.push(processoExecutando);
      } else if (processoExecutando.tempoRestante > 0) {
        fila.push(processoExecutando);
        fila.sort(
          (a, b) =>
            a.tempoChegada + a.deadline - (b.tempoChegada + b.deadline)
        );
      }

      processoExecutando = undefined;
    }

    if (!processoExecutando && fila.length > 0) {
      processoExecutando = fila.shift()!;
      processoExecutando?.intervalos.push({ inicio: tempo, fim: undefined });
    }

    if (!processoExecutando) {
      tempo++;
      continue;
    }

    if (quantumRestante > 0 && processoExecutando.tempoRestante > 0) {
      processoExecutando.tempoRestante--;
      quantumRestante--;
    } else if (sobrecargaRestante > 0 && processoExecutando.tempoRestante > 0) {
      sobrecargaRestante--;
    }

    tempo++;
  }

  const tempoExecucaoTotal = resultado.reduce(
    (acc, curr) =>
      acc + (curr.intervalos[curr.intervalos.length - 1].fim! - curr.tempoChegada),
    0
  );

  const tempoExecucaoMedio = tempoExecucaoTotal / resultado.length;

  return { resultado, tempoExecucaoMedio };
}

export function roundRobin(
  processosEntrada: Processo[],
  quantum: number,
  sobrecarga: number
) {
  const fila: Processo[] = [];
  let tempo = 0;
  const resultado: Processo[] = [];
  let processoExecutando: Processo | undefined = undefined;
  let quantumRestante = quantum;
  let sobrecargaRestante = sobrecarga;

  const processos = [...processosEntrada];
  processos.sort((a, b) => a.tempoChegada - b.tempoChegada);

  while (processoExecutando || processos.length > 0 || fila.length > 0) {
    while (processos.length > 0 && processos[0].tempoChegada == tempo) {
      const processoParaEntrarNaFila = processos.shift()!;
      processoParaEntrarNaFila.tempoRestante = processoParaEntrarNaFila.tempoExecucao;
      processoParaEntrarNaFila.intervalos = [];
      fila.push(processoParaEntrarNaFila);
    }

    if (
      processoExecutando &&
      (processoExecutando.tempoRestante === 0 ||
        (quantumRestante === 0 && sobrecargaRestante === 0))
    ) {
      quantumRestante = quantum;
      sobrecargaRestante = sobrecarga;

      const intervalo = processoExecutando.intervalos.pop();
      processoExecutando.intervalos.push({
        inicio: intervalo!.inicio,
        fim: tempo,
      });

      if (processoExecutando.tempoRestante === 0) {
        resultado.push(processoExecutando);
      } else if (processoExecutando.tempoRestante > 0) {
        fila.push(processoExecutando);
      }

      processoExecutando = undefined;
    }

    if (!processoExecutando && fila.length > 0) {
      processoExecutando = fila.shift()!;
      processoExecutando?.intervalos.push({ inicio: tempo, fim: undefined });
    }

    if (!processoExecutando) {
      tempo++;
      continue;
    }

    if (quantumRestante > 0 && processoExecutando.tempoRestante > 0) {
      processoExecutando.tempoRestante--;
      quantumRestante--;
    } else if (sobrecargaRestante > 0 && processoExecutando.tempoRestante > 0) {
      sobrecargaRestante--;
    }

    tempo++;
  }

  const tempoExecucaoTotal = resultado.reduce(
    (acc, curr) =>
      acc + (curr.intervalos[curr.intervalos.length - 1].fim! - curr.tempoChegada),
    0
  );

  const tempoExecucaoMedio = tempoExecucaoTotal / resultado.length;

  return { resultado, tempoExecucaoMedio };
}
