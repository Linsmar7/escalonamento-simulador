import React from "react";
import { Typography } from "@mui/material";
import { DadosGrafico } from "../model";

interface Props {
  animado: boolean;
  onClose: () => void;
  dados: DadosGrafico;
}

function getCor(id: number) {
  switch (id) {
    case 0:
      return "#FFF";
    case 1:
      return "green";
    case 2:
      return "yellow";
    case 3:
      return "gray";
    case 4:
      return "red";
    default:
      return "#FFF";
  }
}

function getLabel(id: number) {
  switch (id) {
    case 0:
      return "Não chegou";
    case 1:
      return "Executando";
    case 2:
      return "Esperando";
    case 3:
      return "Executando após Deadline";
    case 4:
      return "Sobrecarga";
    default:
      return "";
  }
}

const Grafico: React.FC<Props> = ({ dados, onClose, animado }) => {
  return (
    <div>
      <button onClick={onClose}>Voltar</button>
      <div>Tempo médio de turnaround: {dados.tempoRespostaMedio.toFixed(2)}</div>
      <div style={{ position: "relative", width: "max-content" }}>
        {animado && <div className="slide" />}
        {dados.resultado.map((d: any) => (
          <div key={d.numeroProcesso} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {d.numeroProcesso}
            <div style={{ display: "flex" }}>
              {d.resultado.map((r: number, i: number) => (
                <div
                  key={i}
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: getCor(r),
                    border: "1px solid black",
                  }}
                >
                  {i === d?.deadline ? "D" : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "16px", textAlign: "start" }}>
        <Typography variant="h6">Legenda:</Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Array.from({ length: 5 }, (_, i) => i).map((i) => (
            <div key={i} style={{ display: "flex", gap: "8px" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: getCor(i),
                  border: "1px solid black",
                }}
              />
              <Typography>{getLabel(i)}</Typography>
            </div>
          ))}
          <div style={{ display: "flex", gap: "16px" }}>
            <Typography>D</Typography>
            <Typography>Deadline</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grafico;
