export function memoryPush({ numeroProcesso, maxPaginasMemoria }: any, memoria: any[]) {
  // Loop até que todas as páginas de memória sejam alocadas.
  while (maxPaginasMemoria > 0) {
    memoria.map((e) => {
      // Verifica se há páginas de memória disponíveis no bloco.
      if (maxPaginasMemoria > 0) {
        if (e.numeroProcesso == "Vazio") {
          // Se há espaço disponível, aloca as páginas de memória para o processo.
          if (e.paginasMemoria > maxPaginasMemoria) {
            e.paginasMemoria -= maxPaginasMemoria;
            if (memoria.indexOf(e) - 1 >= 0) {
              memoria.splice(memoria.indexOf(e), 0, {
                numeroProcesso,
                maxPaginasMemoria,
              });
            } else {
              memoria.unshift({ numeroProcesso, maxPaginasMemoria });
            }
            maxPaginasMemoria = 0;
          } else if (e.paginasMemoria == maxPaginasMemoria) {
            if (memoria.indexOf(e) - 1 >= 0) {
              memoria.splice(memoria.indexOf(e), 0, {
                numeroProcesso,
                maxPaginasMemoria,
              });
            } else {
              memoria.unshift({ numeroProcesso, maxPaginasMemoria });
            }
            memoria.splice(memoria.indexOf(e), 1);
            maxPaginasMemoria = 0;
          } else if (e.paginasMemoria < maxPaginasMemoria) {
            maxPaginasMemoria -= e.paginasMemoria;
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

    // Encontra o número do processo mais baixo no bloco de memória.
    let min = Number.POSITIVE_INFINITY;
    for (const value of memoria) {
      if (value.numeroProcesso != "Vazio") {
        min = Math.min(min, value.numeroProcesso);
      }
    }

    // Encontra o elemento no bloco de memória com o número do processo mais baixo.
    let e = memoria.find((x) => x.numeroProcesso == min);

    // Aloca as páginas de memória restantes para o processo com o número mais baixo.
    if (maxPaginasMemoria > 0) {
      if (e.paginasMemoria > maxPaginasMemoria) {
        let liberada = e.paginasMemoria;
        memoria.splice(memoria.indexOf(e), 0, {
          numeroProcesso,
          maxPaginasMemoria,
        });
        memoria.splice(memoria.indexOf(e), 0, {
          numeroProcesso: "Vazio",
          paginasMemoria: liberada - maxPaginasMemoria,
        });
        memoria.splice(memoria.indexOf(e), 1);
        maxPaginasMemoria = 0;
      } else if (e.paginasMemoria == maxPaginasMemoria) {
        memoria.splice(memoria.indexOf(e), 0, {
          numeroProcesso,
          maxPaginasMemoria,
        });
        memoria.splice(memoria.indexOf(e), 1);
        maxPaginasMemoria = 0;
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
        maxPaginasMemoria -= liberada;
      }
    }

    // Se todas as páginas de memória foram alocadas, sai do loop.
    if (maxPaginasMemoria == 0) {
      break;
    }
  }

  return memoria;
}
