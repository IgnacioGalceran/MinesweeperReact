export function GetRandomBombs(
  cols: number,
  rows: number,
  bombs: number,
  initialPosition: number
): {
  setPositionsBombs: Set<number>;
  adyacenceMatrix: Map<number, number[]>;
  bombNumber: number[][];
} {
  let positionsBombs: number[] = [];

  for (let i = 0; i < bombs; i++) {
    let finding: boolean = true;

    while (finding) {
      let random = RandomNumber(cols, rows, initialPosition);
      const exists = positionsBombs?.find((pos: number) => {
        return pos === random;
      });

      if (!exists) {
        positionsBombs[i] = random;
        finding = false;
      }
    }
  }

  let setPositionsBombs = new Set(positionsBombs);

  const { adyacenceMatrix, bombNumber } = GenerateAdyacentMatrix(
    cols,
    rows,
    setPositionsBombs
  );

  return { setPositionsBombs, adyacenceMatrix, bombNumber };
}

const RandomNumber = (
  cols: number,
  rows: number,
  initialPosition: number
): number => {
  let randomValue = Math.floor(Math.random() * (cols * rows) + 1);
  do {
    randomValue = Math.floor(Math.random() * (cols * rows) + 1);
  } while (randomValue === initialPosition);
  return randomValue;
};

const GenerateAdyacentMatrix = (
  cols: number,
  rows: number,
  bombSet: Set<number>
): { adyacenceMatrix: Map<number, number[]>; bombNumber: number[][] } => {
  let bombNumber: number[][] = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => {
      return 0;
    })
  );
  let adyacenceMatrix = new Map();
  let adyacentPoints: number[] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let pos = j + cols * i + 1;
      if (!bombSet.has(pos)) {
        bombNumber[i][j] = 0;
        //Arriba
        if (i > 0 && pos - cols * i > 0 && bombSet.has(pos - cols)) {
          bombNumber[i][j]++;
          adyacentPoints.push(pos - cols);
        }
        //Arriba izquierda
        if (i > 0 && pos - cols * i - 1 >= 1 && bombSet.has(pos - cols - 1)) {
          bombNumber[i][j]++;
          adyacentPoints.push(pos - cols - 1);
        }
        //Arriba derecha
        if (
          i > 0 &&
          pos - cols * i + 1 <= cols &&
          bombSet.has(pos - cols + 1)
        ) {
          bombNumber[i][j]++;
          adyacentPoints.push(pos - cols + 1);
        }
        //Abajo
        if (pos + cols <= rows * cols && bombSet.has(pos + cols)) {
          bombNumber[i][j]++;
          adyacentPoints.push(pos + cols);
        }
        //Abajo izquierda
        if (pos - cols * i - 1 >= 1 && bombSet.has(pos + cols - 1)) {
          bombNumber[i][j]++;
          adyacentPoints.push(pos + cols - 1);
        }
        //Abajo derecha
        if (pos - cols * i + 1 <= cols && bombSet.has(pos + cols + 1)) {
          bombNumber[i][j]++;
          adyacentPoints.push(pos + cols + 1);
        }
        //Izquierda
        if (j > 0 && bombSet.has(pos - 1)) {
          bombNumber[i][j]++;
          adyacentPoints.push(pos - 1);
        }
        //Derecha
        if (j < cols - 1 && bombSet.has(pos + 1)) {
          bombNumber[i][j]++;
          adyacentPoints.push(pos + 1);
        }

        adyacenceMatrix.set(pos, adyacentPoints);
        adyacentPoints = [];
      }
    }
  }

  return { adyacenceMatrix, bombNumber };
};

export function bfs(
  adyacenceMatrix: Map<number, number[]>,
  initialPosition: number,
  cols: number,
  rows: number
): number[] {
  let currentPosition: number | undefined = initialPosition;
  const queue: number[] = [currentPosition];
  const visited = new Set<number>();
  const discovered: number[] = [];

  while (queue.length > 0) {
    currentPosition = queue.shift();

    if (currentPosition === undefined || visited.has(currentPosition)) {
      continue;
    }

    visited.add(currentPosition);
    discovered.push(currentPosition);

    // Verificar si el nodo tiene bombas adyacentes
    const neighbors = adyacenceMatrix.get(currentPosition);
    if (neighbors && neighbors.length > 0) {
      continue; // Detener la búsqueda en este nodo
    }

    const i = Math.floor((currentPosition - 1) / cols);
    const j = (currentPosition - 1) % cols;

    // Arriba
    if (i > 0) {
      const neighborPos = (i - 1) * cols + j + 1;
      if (!visited.has(neighborPos)) {
        queue.push(neighborPos);
      }
    }
    // Arriba izquierda
    if (i > 0 && j > 0) {
      const neighborPos = (i - 1) * cols + (j - 1) + 1;
      if (!visited.has(neighborPos)) {
        queue.push(neighborPos);
      }
    }
    // Arriba derecha
    if (i > 0 && j < cols - 1) {
      const neighborPos = (i - 1) * cols + (j + 1) + 1;
      if (!visited.has(neighborPos)) {
        queue.push(neighborPos);
      }
    }
    // Abajo
    if (i < rows - 1) {
      const neighborPos = (i + 1) * cols + j + 1;
      if (!visited.has(neighborPos)) {
        queue.push(neighborPos);
      }
    }
    // Abajo izquierda
    if (i < rows - 1 && j > 0) {
      const neighborPos = (i + 1) * cols + (j - 1) + 1;
      if (!visited.has(neighborPos)) {
        queue.push(neighborPos);
      }
    }
    // Abajo derecha
    if (i < rows - 1 && j < cols - 1) {
      const neighborPos = (i + 1) * cols + (j + 1) + 1;
      if (!visited.has(neighborPos)) {
        queue.push(neighborPos);
      }
    }
    // Izquierda
    if (j > 0) {
      const neighborPos = i * cols + (j - 1) + 1;
      if (!visited.has(neighborPos)) {
        queue.push(neighborPos);
      }
    }
    // Derecha
    if (j < cols - 1) {
      const neighborPos = i * cols + (j + 1) + 1;
      if (!visited.has(neighborPos)) {
        queue.push(neighborPos);
      }
    }
  }

  return discovered;
}
