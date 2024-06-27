"use client";
import React, { useEffect, useState } from "react";
import { GetRandomBombs } from "../functions/functions";
import { BoardProps } from "../types/BoardProps";
import Image from "next/image";

import styles from "@/app/styles/board.module.css";

export default function Board({ props, state }: BoardProps) {
  const { isPlaying, setIsPlaying } = state;
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [initialPosition, setInitialPosition] = useState<number>(0);
  const [board, setBoard] = useState<JSX.Element[][]>();
  const { cols, rows, bombs } = props;

  useEffect(() => {
    const drawBoard = (): JSX.Element[][] => {
      const { setPositionsBombs, adyacenceMatrix, bombNumber } = GetRandomBombs(
        cols,
        rows,
        bombs,
        initialPosition
      );

      let array: JSX.Element[][] = Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => {
          const key = j + cols * i + 1;
          return (
            <div
              id={key.toString()}
              key={key.toString()}
              className={`${setPositionsBombs.has(key) ? styles.bomb : ""} ${
                styles["cube" + bombNumber[i][j].toString()]
              }`}
            >
              {!setPositionsBombs.has(key) ? (
                bombNumber[i][j] > 0 && bombNumber[i][j]
              ) : (
                <Image src={"/bomb.png"} width={20} height={20} alt="" />
              )}
            </div>
          );
        })
      );

      return array;
    };

    if (isPlaying) {
      setBoard(drawBoard());
    } else {
      let array: JSX.Element[][] = Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => {
          const key = j + cols * i + 1;
          return (
            <div
              id={key.toString()}
              key={key.toString()}
              onClick={() => {
                setInitialPosition(i * cols + (j + 1));
                setIsPlaying(true);
              }}
              className={styles["cube0"]}
            ></div>
          );
        })
      );

      setBoard(array);
    }
  }, [cols, rows, isPlaying]);

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
