export function memoryPush(
  { numeroProcesso, paginasMemoria }: any,
  memoria: any[]
) {
  while (paginasMemoria > 0) {
    memoria.map((e) => {
      if (paginasMemoria > 0) {
        if (e.numeroProcesso == "Vazio") {
          if (e.paginasMemoria > paginasMemoria) {
            e.paginasMemoria -= paginasMemoria;
            if (memoria.indexOf(e) - 1 >= 0) {
              memoria.splice(memoria.indexOf(e), 0, {
                numeroProcesso,
                paginasMemoria,
              });
            } else {
              memoria.unshift({ numeroProcesso, paginasMemoria });
            }
            paginasMemoria = 0;
          } else if (e.paginasMemoria == paginasMemoria) {
            if (memoria.indexOf(e) - 1 >= 0) {
              memoria.splice(memoria.indexOf(e), 0, {
                numeroProcesso,
                paginasMemoria,
              });
            } else {
              memoria.unshift({ numeroProcesso, paginasMemoria });
            }
            memoria.splice(memoria.indexOf(e), 1);
            paginasMemoria = 0;
          } else if (e.paginasMemoria < paginasMemoria) {
            paginasMemoria -= e.paginasMemoria;
            if (memoria.indexOf(e) - 1 >= 0) {
              memoria.splice(memoria.indexOf(e), 0, {
                numeroProcesso,
                paginasMemoria: e.paginasMemoria,
              });
            } else {
              memoria.unshift({
                numeroProcesso,
                paginasMemoria: e.paginasMemoria,
              });
            }
            memoria.splice(memoria.indexOf(e), 1);
          }
        }
      }
    });
    let min = Number.POSITIVE_INFINITY;
    for (const value of memoria) {
      if (value.numeroProcesso != "Vazio") {
        min = Math.min(min, value.numeroProcesso);
      }
    }
    let e = memoria.find((x) => x.numeroProcesso == min);
    if (paginasMemoria > 0) {
      if (e.paginasMemoria > paginasMemoria) {
        let liberada = e.paginasMemoria;
        memoria.splice(memoria.indexOf(e), 0, {
          numeroProcesso,
          paginasMemoria,
        });
        memoria.splice(memoria.indexOf(e), 0, {
          numeroProcesso: "Vazio",
          paginasMemoria: liberada - paginasMemoria,
        });
        memoria.splice(memoria.indexOf(e), 1);
        paginasMemoria = 0;
      } else if (e.paginasMemoria == paginasMemoria) {
        memoria.splice(memoria.indexOf(e), 0, {
          numeroProcesso,
          paginasMemoria,
        });
        memoria.splice(memoria.indexOf(e), 1);
        paginasMemoria = 0;
      } else {
        let liberada = e.paginasMemoria;
        if (memoria.indexOf(e) - 1 >= 0) {
          memoria.splice(memoria.indexOf(e), 0, {
            numeroProcesso,
            paginasMemoria: liberada,
          });
        } else {
          memoria.unshift({ numeroProcesso, paginasMemoria: liberada });
        }
        memoria.splice(memoria.indexOf(e), 1);
        paginasMemoria -= liberada;
      }
    }
    if (paginasMemoria == 0) {
      break;
    }
  }

  return memoria;
}
