import styles from "../styles/Home.module.css";
import React from "react";

interface User {
    name: string
}

export default function Card({idx, names}: {idx: string, names: User[]}) {
  return (
      <div className={styles.flex, styles.card}>
          <div>{idx}</div>
          <div>
              {names.map((user: User) => <div key={user.name}>{user.name}</div>)}
          </div>
      </div>
  )

}