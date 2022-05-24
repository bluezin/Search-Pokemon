import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import produce from "immer";
import { readImage } from "./read-image";
import "./tailwind.output.css";
import "./tailwind.css";

function fetcher(url) {
  return fetch(url).then((response) => response.json());
}

function Pokemon({ name }) {
  const { data, error } = useSWR(
    `https://pokeapi.co/api/v2/pokemon/${name}`,
    fetcher
  );

  if (error) return <h1>Your pokemon was not found</h1>;
  if (!data) return <h1>Loading...</h1>;

  return (
    <div>
      <h1 className="bg-blue-200 pt-1 mt-4">{data.name}</h1>
      <img
        src={data.sprites.front_default}
        alt=""
        className="w-16 md:w-32 lg:w-48 imagen"
      />
    </div>
  );
}

function App() {
  const [poke, setPoke] = useState("pikachu");
  const [name, setName] = useState(["pikachu"]);

  function handleSubmit(event) {
    event.preventDefault();
    setName(poke);
  }

  function handleChange(event) {
    setPoke(event.target.value.toLowerCase());
  }

  useEffect(() => {
    const time = setTimeout(async () => {
      readImage(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name}.png`
      );
      await mutate(
        `https://pokeapi.co/api/v2/pokemon/${name}`,
        fetcher(`https://pokeapi.co/api/v2/pokemon/${name}`)
      );
      setName(poke);
    }, 900);
    return () => clearTimeout(time);
  }, [name]);

  function rename() {
    mutate(
      `https://pokeapi.co/api/v2/pokemon/${name}`,
      produce((draft) => {
        draft.name = "My favorite pokemon";
      }),
      false
    );
  }

  return (
    <div className="flex justify-center  bg-gray-200 fixed inset-0 items-center">
      <div className="text-center div">
        <form onSubmit={handleSubmit}>
          <input
            value={poke}
            onChange={handleChange}
            className="bg-white-200 focus:bg-white border-transparent focus:border-blue-400 p-2 ..."
          />
          <button className="bg-blue-500 hover:bg-black-700 text-white font-bold py-2 px-4 rounded mt-8 ml-6">
            Searche...
          </button>
        </form>

        {name.length === 0 ? <p>Busca un pokemon</p> : <Pokemon name={name} />}

        <button
          onClick={rename}
          className="bg-red-500 hover:bg-red-700 mt-3 text-white font-bold py-2 px-4 rounded"
        >
          Rename
        </button>
      </div>
    </div>
  );
}

export default App;
