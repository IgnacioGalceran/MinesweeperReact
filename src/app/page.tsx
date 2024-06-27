"use client";
import React, { useState } from "react";
import Board from "./components/Board";
import styles from "./page.module.css";
import { FACIL, MEDIO, DIFICIL } from "./constants/const";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [level, setLevel] = useState(FACIL);

  const SettingLevel = (e: any) => {
    const { value } = e.target;

    switch (value) {
      case "Facil":
        setLevel(FACIL);
        break;
      case "Medio":
        setLevel(MEDIO);
        break;
      case "Dificil":
        setLevel(DIFICIL);
        break;
      default:
        break;
    }

    setIsPlaying(false);
  };

  return (
    <main className={styles.main}>
      <button onClick={() => setIsPlaying(false)}>Reiniciar</button>
      <select onChange={(e) => SettingLevel(e)}>
        <option value="Facil">Facil</option>
        <option value="Medio">Medio</option>
        <option value="Dificil">Dificil</option>
      </select>
      <Board props={level} state={{ setIsPlaying, isPlaying }} />
    </main>
  );
}
