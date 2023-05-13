import Head from 'next/head'
import Image from 'next/image'
//import { Inter } from 'next/font/google'
//import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'

//const inter = Inter({ subsets: ['latin'] })

export default function Home({pokemonTypes}) {

  let [pokedex, setPokedex] = useState([]);
  let [filteredPokedex, setFilterPokedex] = useState([]);
  let [currentPage, setCurrentPage] = useState(1); 
  let [indexState, setIndexState] = useState(0);
  let [indexFilterState, setIndexFilterState] = useState(0); 
 

  useEffect(() => {
    console.log("Start" + indexState)
    console.log("CurrentPage" + currentPage)
    if (filteredPokedex.length == 0) {
      getAllPokemon();
    } 
  }, [currentPage]);

  useEffect(() => {
    return () => {
      setPokedex(null)
    }
  }, [filteredPokedex])

  async function handleNext() {
    setCurrentPage(currentPage + 1);
    return;
  }

  async function handlePageDirect(page) {
    setIndexState((page * 9) - 9)
    setCurrentPage(page);
    return; 
  }

  async function handlePrevious() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      return;
    }
  }

  async function filterType(event) {
    let typeId = event.target.name;

    const options = {
      "method": "GET", 
      "Content-header": "application/json"
    }
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${typeId}/`, options);
      const responseJSON = await response.json();

      let pokemon = responseJSON.pokemon;
      
      const startIndex = indexFilterState; 
      const endIndex = currentPage * 9; 
      console.log(pokemon)

      console.log("End" + endIndex)
      console.log(startIndex)
      //console.log(responseJSON.results.slice(startIndex, endIndex))
      setFilterPokedex(responseJSON.pokemon.slice(startIndex, endIndex)); 
      setIndexState(endIndex + 1);
      
    } catch (err) {
      console.log(err); 
    }
  }

  async function getAllPokemon() {
    const options = {
      "method": "GET",
      "Content-header": "application/json"
    }

    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=810', options);
    const responseJSON = await response.json();

    const startIndex = indexState; 
    const endIndex = currentPage * 9; 

    //console.log(responseJSON.results.slice(startIndex, endIndex))
    setPokedex(responseJSON.results.slice(startIndex, endIndex)); 
    setIndexState(endIndex + 1);
    
    return;
  }

  return (
    <>
    <div>
      <h1>PokeDex</h1>
      <div style={{padding: '3px', display: "flex", flexDirection:"row", minWidth: "15px", maxWidth: "20px"}}>

      {pokemonTypes.map((type, index) => {
        return (
          <div style={{padding: '15px', align:"center"}}>
          <label htmlFor={type.name}>{type.name}</label>
          <input key={index} type="checkbox" id={type.name} name={index + 1} onChange={(event) => filterType(event)}></input>
          </div>)
      })}

     </div>

      {pokedex ? pokedex.map(pokemon => {
        return <p>{pokemon.name}</p>
      }) : filteredPokedex.map(pokemon => {
        return <p>{pokemon && pokemon.pokemon.name}</p>
      })}

    
      <hr></hr>

      {currentPage != 1 ? <button>Previous</button> : <p></p>}
      {currentPage > 2 ? <button onClick={() => handlePageDirect(currentPage - 2)}>{currentPage - 2}</button> : <></>}
      {currentPage > 1 ? <button onClick={() => handlePageDirect(currentPage - 1)}>{currentPage - 1}</button> :<></>}

      <button onClick={() => handlePageDirect(currentPage)}>{currentPage}</button>
      <button onClick={() => handlePageDirect(currentPage + 1)}>{currentPage + 1}</button>
      <button onClick={() => handlePageDirect(currentPage + 2)}>{currentPage + 2}</button>
      <button onClick={() => {handleNext()}}>NEXT</button>

      <p>{currentPage}</p>

    </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const options = {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  }

  const response = await fetch("https://pokeapi.co/api/v2/type/", options);
  const responseJSON = await response.json(); 

  return {
      props: {
          pokemonTypes: responseJSON.results
      },
  };
}