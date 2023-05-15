import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';

export function PokemonModal(props) {
    const [show, setShow] = useState(false);
    const [pokemonInfo, setPokemonInfo] = useState();

    const handleClose = () => setShow(false);
    const showModal = () => setShow(true);

    async function seeMore(event) {
        const endpoint = event.target.getAttribute('data-endpoint');

        const options = {
            "method": "GET", 
            "Content-header": "application/json"
          }
      
          try {
            const response = await fetch(endpoint, options);
            const responseJSON = await response.json();
            setPokemonInfo(responseJSON);
            showModal();
      
          } catch (err) {
            console.log(err); 
          }
      }
    
    return (
        <>
        <Button data-endpoint={props.pokemonAPI} onClick={(event) => seeMore(event)}>See More</Button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{pokemonInfo ? <p>{pokemonInfo.name}</p> : <></>}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Card style={{ width: '35%', margin: "20px", alignSelf:"center"}}>
                <Card.Img variant="top" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.pokemonAPI.split("/").slice(-2, -1)[0]}.png`} />
            </Card>
            <h3>Abilities</h3>
            <hr></hr> {pokemonInfo ? pokemonInfo.abilities.map(type => {return <li key={type.ability.name}>{type.ability.name}</li>}) : <></>}
            <br></br>
            <h3>Types:</h3> 
            <hr></hr>{pokemonInfo ? pokemonInfo.types.map(type => {return <li key={type.type.name}>{type.type.name}</li>}) : <></>}
            <br></br>
            <h3>Weight:</h3> 
            <hr>
            </hr>{pokemonInfo ? <li>{pokemonInfo.weight}</li> : <></>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
  
        </Modal.Footer>
      </Modal>
        </>


    )
}
