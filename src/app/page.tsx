"use client";
import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import styles from "./page.module.css";
import { FACIL, MEDIO, DIFICIL, DIFICIL_MOBILE } from "./constants/const";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [wonGame, setWonGame] = useState<boolean>(false);
  const [level, setLevel] = useState(FACIL);
  const [levelName, setLevelName] = useState("facil");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobileDevice);
  }, []);

  const SettingLevel = (e: any) => {
    const { value } = e.target;

    switch (value) {
      case "Facil":
        setLevel(FACIL);
        setLevelName("facil");
        break;
      case "Medio":
        setLevel(MEDIO);
        setLevelName("medio");
        break;
      case "Dificil":
        if (isMobile) {
          setLevel(DIFICIL_MOBILE);
        } else {
          setLevel(DIFICIL);
        }
        setLevelName("dificil");
        break;
      default:
        break;
    }

    setIsPlaying(false);
  };

  return (
    <main className={styles.main}>
      <div className={styles.text}>
        {!isGameOver && !wonGame && <h1>Juego del buscaminas</h1>}
        {isGameOver && !wonGame && <h1>Perdiste :c</h1>}
        {wonGame && isGameOver && <h1>Ganaste!!</h1>}
      </div>
      <p>Nivel de juego</p>
      <select className={styles.select} onChange={(e) => SettingLevel(e)}>
        <option className={styles.select} value="Facil">
          Facil
        </option>
        <option className={styles.select} value="Medio">
          Medio
        </option>
        <option className={styles.select} value="Dificil">
          Dificil
        </option>
      </select>
      <button className={styles.button} onClick={() => setIsPlaying(false)}>
        Reiniciar
      </button>
      <Board
        props={level}
        state={{
          setIsPlaying,
          isPlaying,
          setIsGameOver,
          isGameOver,
          setWonGame,
          level: levelName,
        }}
      />
    </main>
  );
}
