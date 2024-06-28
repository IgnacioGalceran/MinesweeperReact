"use client";
import React, { useEffect, useState } from "react";
import { GetRandomBombs, bfs } from "../functions/functions";
import { BoardProps } from "../types/BoardProps";
import Loader from "./Loader";
import Image from "next/image";

import styles from "@/app/styles/board.module.css";
import stylesModal from "@/app/styles/modal.module.css";

export default function Board({ props, state }: BoardProps) {
  const { isPlaying, setIsPlaying, setIsGameOver, setWonGame, isGameOver } =
    state;
  const { cols, rows, bombs } = props;
  const [discovered, setDiscovered] = useState<Set<number>>(new Set());
  const [board, setBoard] = useState<JSX.Element[][]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<any>({
    state: false,
    position: null,
  });

  const [bombNumber, setBombNumber] = useState<number[][]>([]);
  const [initialPosition, setInitialPosition] = useState<number | null>(null);
  const [adyacenceMatrix, setAdyacenceMatrix] = useState<Map<number, number[]>>(
    new Map()
  );
  const [positionsBombs, setPositionBombs] = useState<Set<number>>(new Set());

  const GetRandom = (
    cols: number,
    rows: number,
    bombs: number,
    initialPosition: number
  ) => {
    const { setPositionsBombs, adyacenceMatrix, bombNumber } = GetRandomBombs(
      cols,
      rows,
      bombs,
      initialPosition
    );
    setPositionBombs(setPositionsBombs);
    setBombNumber(bombNumber);
    setAdyacenceMatrix(adyacenceMatrix);
    setInitialPosition(initialPosition);
    return { setPositionsBombs, adyacenceMatrix, bombNumber };
  };

  useEffect(() => {
    const mobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobileDevice);
  }, []);

  useEffect(() => {
    if (initialPosition && adyacenceMatrix) {
      let element = document.getElementById(initialPosition.toString());
      if (element) {
        const adyacentes = adyacenceMatrix.get(initialPosition);
        if (adyacentes !== undefined && adyacentes.length) {
          element.innerHTML = adyacentes.length.toString();
          handleAddPosition(initialPosition);
          const className = `cube${adyacentes.length.toString()}`;
          if (styles[className]) {
            element.classList.add(styles[className]);
          }
        } else {
          discoverNeighborhood(initialPosition);
        }
      }
    }
  }, [initialPosition]);

  useEffect(() => {
    const drawBoard = (): JSX.Element[][] => {
      let array: JSX.Element[][] = Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => {
          const key = j + cols * i + 1;

          return (
            <div
              id={key.toString()}
              key={key.toString()}
              onContextMenu={(e) => handleRightClick(key, e)}
              onClick={(e) => handleClickCube(key, e)}
              className={`${
                discovered.has(key)
                  ? `${styles.discovered} ${
                      styles["cube" + bombNumber[i][j].toString()]
                    }`
                  : styles["cube" + bombNumber[i][j].toString()]
              } ${bombNumber[i][j].toString()}`}
            >
              {discovered.has(key) &&
                bombNumber[i][j] > 0 &&
                bombNumber[i][j].toString()}
            </div>
          );
        })
      );

      return array;
    };

    if (isPlaying) {
      setBoard(drawBoard());
    } else {
      clearStates();
    }
  }, [cols, rows, isPlaying]);

  const handleAddPosition = (initialPosition: number) => {
    setDiscovered(discovered.add(initialPosition));
    let element = document.getElementById(initialPosition.toString());
    if (element) {
      element.classList.add(styles.discovered);
    }
  };

  const handleRightClick = (position: number, e: any) => {
    e.preventDefault();

    if (discovered.has(position)) return;

    let element = document.getElementById(position.toString());
    if (!element) return;
    if (!element.className.includes("marked")) {
      element.classList.add(`${styles.marked}`);
    } else {
      element.classList.remove(styles.marked);
    }
  };

  const clearStates = () => {
    console.log("clear");
    setDiscovered(new Set());
    setPositionBombs(new Set());
    setAdyacenceMatrix(new Map());
    setWonGame(false);
    setBombNumber([]);
    setIsGameOver(false);
    setInitialPosition(null);

    let array = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) => {
        const key = j + cols * i + 1;
        return (
          <div
            id={key.toString()}
            key={key.toString()}
            onClick={() => {
              let initialPosition = i * cols + (j + 1);
              GetRandom(cols, rows, bombs, initialPosition);
              setIsPlaying(true);
            }}
            className={styles["cube"]}
          >
            {" "}
          </div>
        );
      })
    );

    setBoard(array);
  };

  const handleClickCube = (position: number, e: any) => {
    if (discovered.has(position)) return;

    if (isMobile) {
      const { clientX: x, clientY: y } = e;
      setOpenMobileMenu({
        state: true,
        position: position,
        coordinates: { x, y },
      });
    } else {
      handleAddPosition(position);
      updateBoard(position);
    }
  };

  const handleClickMobile = (position: number) => {
    handleAddPosition(position);
    updateBoard(position);
  };

  const updateBoard = (clickPosition: number): void => {
    let element = document.getElementById(clickPosition.toString());

    if (positionsBombs.has(clickPosition)) {
      setIsGameOver(true);
      showBombs();
      return;
    }

    if (element) {
      if (adyacenceMatrix.get(clickPosition)?.length) {
        element.innerHTML =
          adyacenceMatrix.get(clickPosition)?.length.toString() || "";
        handleAddPosition(clickPosition);
      } else {
        discoverNeighborhood(clickPosition);
      }
    }

    if (discovered.size + positionsBombs.size === cols * rows) {
      setWonGame(true);
      setIsGameOver(true);
    }
  };

  const showBombs = () => {
    positionsBombs.forEach((pos) => {
      let element = document.getElementById(pos.toString());
      if (element) {
        element.classList.add(styles.bomb);
      }
    });
  };

  const discoverNeighborhood = (position: number) => {
    const neighborhood = bfs(adyacenceMatrix, position, cols, rows);
    neighborhood.forEach((neigh: number) => {
      handleAddPosition(neigh);
      let bombs = adyacenceMatrix.get(neigh)?.length;
      let element = document.getElementById(neigh.toString());
      if (element && bombs && bombs >= 0) {
        element.innerHTML = bombs.toString();
      }
    });

    if (discovered.size + positionsBombs.size === cols * rows) {
      setWonGame(true);
      setIsGameOver(true);
    }
  };

  return (
    <>
      <section
        className={`${styles.board} ${isGameOver ? styles.disabled : ""}`}
      >
        {board?.length ? (
          board?.map((row: any, index: number) => {
            return (
              <div key={index} className={styles.rows}>
                {row.map((col: any, index: number) => {
                  return col;
                })}
              </div>
            );
          })
        ) : (
          <Loader />
        )}
      </section>
      {openMobileMenu.state && (
        <div
          className={stylesModal.modalContainer}
          onClick={() => setOpenMobileMenu({ state: false, position: null })}
        >
          <div
            className={stylesModal.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={stylesModal.shovel}
              onClick={() => {
                handleClickMobile(openMobileMenu.position);
                setOpenMobileMenu({ state: false, position: null });
              }}
            >
              <Image src={"/shovel.png"} width={50} height={50} alt="shovel" />
            </button>
            <button
              className={stylesModal.flag}
              onClick={(e) => {
                handleRightClick(openMobileMenu.position, e);
                setOpenMobileMenu({ state: false, position: null });
              }}
            >
              <Image src={"/flag.png"} width={50} height={50} alt="flag" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
