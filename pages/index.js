import { useEffect, useState, useRef } from 'react'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PokemonModal } from '@/components/PokemonModal';
import Card from 'react-bootstrap/Card';


async function getAllPokemon() {
  const options = {
    "method": "GET",
    "Content-header": "application/json"
  }

  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=810', options);
  const responseJSON = await response.json();

  return responseJSON;
}

export default function Home({ pokemonTypes, pokedex },) {
  let [allPokemon, setAllPokemon] = useState();
  let [filteredPokedex, setFilterPokedex] = useState([]);
  let [currentPokemon, setCurrentPokemon] = useState();

  let [currentPage, setCurrentPage] = useState(1);
  let [indexState, setIndexState] = useState(0);
  let [filterState, setFilterState] = useState(0);
  let [pokemonCount, setPokemonCount] = useState();

  let [count, setCount] = useState(1);

  let currentType = useRef("")

  useEffect(() => {
    displayPokemon()
  }, [currentPage, filteredPokedex]);

  useEffect(() => {
    displayPokemon();
    setPokemon();
  }, []);

  function setPokemon() {
    setAllPokemon(pokedex)
    setPokemonCount(pokedex.length)
    return;
  }

  async function handleNext() {
    setCurrentPage(currentPage + 1);
    return;
  }

  async function handlePageDirect(page) {
    console.log(page)
    if (filteredPokedex.length > 0) {
      setFilterState((page * 9) - 9)
      setCurrentPage(page);
    } else {
      setIndexState((page * 9) - 9)
      setCurrentPage(page);
    }

    return;
  }

  async function handlePrevious() {
    if (currentPage > 1) {
      if (indexState > 0) {
        setIndexState((currentPage * 9) - 18);
      }

      if (filterState > 0) {
        setFilterState((currentPage * 9) - 18);
      }

      setCurrentPage(currentPage - 1);

      return;
    }
  }

  async function filterType(event) {
    let typeID = "";

    if (event.target.checked) {
      setFilterState(0)
      setIndexState(0)
      setCurrentPage(1)
      typeID = event.target.name;
      currentType.current = typeID;
    } else {
      typeID = currentType.current
    }

    if (!event.target.checked) {
      setFilterState(0)
      setIndexState(0)
      setCurrentPage(1)
      setFilterPokedex([])
      return;
    }

    const options = {
      "method": "GET",
      "Content-header": "application/json"
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${typeID}/`, options);
      const responseJSON = await response.json();

      setFilterPokedex(responseJSON.pokemon)
      setPokemonCount(responseJSON.pokemon.length)

    } catch (err) {
      console.log(err);
    }
  }

  function displayPokemon() {
    let startIndex;
    let endIndex = currentPage * 9;

    if (filteredPokedex.length > 0) {
      startIndex = filterState;
      let newFilter = filteredPokedex.slice(startIndex, endIndex).map(pokemon => {
        return pokemon.pokemon
      })
      setCurrentPokemon(newFilter);
      setFilterState(endIndex);
      return;

    } else {
      startIndex = indexState
      setCurrentPokemon(pokedex.slice(startIndex, endIndex));
      setIndexState(endIndex);
      return;
    }
  }

  return (
    <>
      <div>
        <h1>PokeDex</h1>
        <div class="check-container">
          {pokemonTypes.map((type, index) => {
            return (
              <div key={index} class="pokemon-check" >
                <input key={index} type="checkbox" id={type.name} name={index + 1} onChange={(event) => filterType(event)}></input>
                <label key={type.name} style={{ paddingLeft: "6px" }} class="checklabel" htmlFor={type.name}>{type.name}</label>
              </div>)
          })}
        </div>

        <h3>Pokemon Count:</h3><p>{currentPokemon ? currentPokemon.length * currentPage : 0} of {pokemonCount}</p>

        <div class="pokemon-container">
          {currentPokemon ? currentPokemon.map((pokemon) => {
            return <>
              <Card style={{ width: '10rem', margin: "20px", alignContent: "center" }}>
                <Card.Img variant="top" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split("/").slice(-2, -1)[0]}.png`} />
                <Card.Body>
                  <Card.Title style={{ textAlign: "center" }}>{pokemon.name}</Card.Title>
                </Card.Body>
                <PokemonModal pokemonAPI={pokemon.url}></PokemonModal>
              </Card>
            </>
          }) : <p>s</p>}
        </div>

        <hr></hr>

        {currentPage != 1 ? <Button onClick={() => { handlePrevious() }}>Previous</Button> : <p></p>}
        {currentPage > 2 ? <Button className="pageButton" variant="primary" onClick={() => handlePageDirect(currentPage - 2)}>{currentPage - 2}</Button> : <></>}
        {currentPage > 1 ? <Button className="pageButton" variant="primary" onClick={() => handlePageDirect(currentPage - 1)}>{currentPage - 1}</Button> : <></>}

        <Button className="pageButton" variant="dark" onClick={() => handlePageDirect(currentPage)}>{currentPage}</Button>
        {(currentPage + 1) * 9 <= pokemonCount ? <Button className="pageButton" variant="primary" onClick={() => handlePageDirect(currentPage + 1)}>{currentPage + 1}</Button> : <></>}
        {(currentPage + 2) * 9 <= pokemonCount ? <Button className="pageButton" onClick={() => handlePageDirect(currentPage + 2)}>{currentPage + 2}</Button> : <></>}

        {(currentPage + 2) * 9 <= pokemonCount ? <Button variant="primary" className="pageButton" onClick={() => { handleNext() }}>NEXT</Button> : <></>}

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

  const pokedex = await getAllPokemon();

  return {
    props: {
      pokemonTypes: responseJSON.results,
      pokedex: pokedex.results
    },
  };
}