import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {FormEvent, useState} from 'react'
import Card from "../components/card"

interface User {
  name: string
}

type SortDirection = "asc" | "desc"

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/names')
  const data = await res.json()
  return {
    props: {data}
  };
}

function alphabetically(currLine: User, nextLine: User) {
  return currLine.name > nextLine.name ? 1 : -1
}

function alphabeticallyRevers(currLine: User, nextLine: User) {
  return currLine.name > nextLine.name ? -1 : 1
}

function extractChar(alfa: Record<string, User[]>, curr: User): Record<string, User[]>{
  const key: string = curr.name['0']
  if (alfa.hasOwnProperty(key)) {
    alfa[key].push(curr)
  } else {
    alfa[key] = [curr]
  }
  return alfa
}

function orderCards(sortCallback: Function, data: User[]): JSX.Element[] {
  data.sort(sortCallback)
  const names: Record<string, User[]> = data.reduce(extractChar, {})
  const namesTemplate = []
  for (let idx in names) {
    namesTemplate.push(<Card key={idx} idx={idx} names={names[idx]}/>)
  }
  return namesTemplate
}

export default function Home({data}: {data: User[]}) {
  const arrowUp = <span>&uarr;</span>
  const arrowDown = <span>&darr;</span>
  const [sortDirection, setDirection] = useState<SortDirection>('asc')
  const [arrow, setArrow] = useState<JSX.Element>(<span>&uarr;</span>)
  const [namesData, setData] = useState<JSX.Element[]>(orderCards(alphabetically, data))
  const [filterKey, setFilterKey] = useState<string>("")
  let timeout = null;

  const resort = () => {
    if (filterKey !== "") {
      data = data.filter((line: User) => {
        if (line.name.toLowerCase().includes(filterKey)) {
          return 1
        }
      })
    }

    if (sortDirection === 'asc') {
      setArrow(arrowDown)
      setDirection('desc')
      setData(orderCards(alphabeticallyRevers, data))
    } else {
      setArrow(arrowUp)
      setDirection('asc')
      setData(orderCards(alphabetically, data))
    }
  }

  const find = (event: FormEvent<HTMLInputElement>) => {
    let key = event.target.value.toLowerCase()
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      const filteredData: User[] = data.filter((line: User) => {
        if (line.name.toLowerCase().includes(key)) {
          return 1
        }
      })
      setData(orderCards(alphabetically, filteredData))
    },400)
    setFilterKey(key)
  }

  return (
    <div>
      <Head>
        <title>Names app</title>
      </Head>
      <main>
        <div className={styles.flex}>
          <div>
            <input onInput={find} type="text"/>
          </div>
          <div>
            <button onClick={resort}>{arrow}</button>
          </div>
        </div>
        <div className={styles.flex}>
          { namesData }
        </div>
      </main>
    </div>
  )
}
