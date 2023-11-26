export interface Intervalo {
  inicio: number | undefined;
  fim: number | undefined;
}

export interface Processo {
  numeroProcesso: number;
  tempoChegada: number;
  tempoExecucao: number;
  deadline: number;
  tempoRestante: number;
  tempoFinalizado: number;
  foraDoDeadline: boolean;
  intervalos: Intervalo[];
  paginasMemoria?: number;
}

export interface Resultado {
  numeroProcesso: number;
  resultado: number[];
  deadline?: number;
}

export interface DadosGrafico {
  tempoRespostaMedio: number;
  resultado: Resultado[];
}

export enum TipoAlgoritmo {
  fifo = "fifo",
  sjf = "sjf",
  edf = "edf",
  rr = "rr",
}

export interface DadosConversao {
  processos: Processo[];
  algoritmo: TipoAlgoritmo;
  quantum: number;
  sobrecarga: number;
  setDados: (dados: DadosGrafico) => void;
  setGrafico: (valor: boolean) => void;
}
