"use client";
import React, { useEffect, useState } from "react";
import { BoardProps } from "../types/BoardProps";

import styles from "@/app/styles/board.module.css";
import { GetRandomBombs } from "../functions/functions";

export default function Board({ props }: BoardProps) {
  const [board, setBoard] = useState<JSX.Element[][]>();
  const { cols, rows, bombs } = props;

  useEffect(() => {
    const drawBoard = (): JSX.Element[][] => {
      const { setPositionsBombs, adyacenceMatrix, bombNumber } = GetRandomBombs(
        cols,
        rows,
        bombs
      );

      console.log(bombNumber);

      let array: JSX.Element[][] = Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => {
          const key = j + cols * i + 1;
          return (
            <div
              id={key.toString()}
              key={key.toString()}
              className={`${setPositionsBombs.has(key) ? styles.bomb : ""} ${
                styles.cube
              }`}
            >
              {!setPositionsBombs.has(key) && bombNumber[i][j]}
            </div>
          );
        })
      );

      return array;
    };

    setBoard(drawBoard());
  }, [cols, rows]);

  return (
    <section className={styles.board}>
      {board?.length &&
        board?.map((row: any, index: number) => {
          return (
            <div key={index} className={styles.rows}>
              {row.map((col: any, index: number) => {
                return col;
              })}
            </div>
          );
        })}
    </section>
  );
}
