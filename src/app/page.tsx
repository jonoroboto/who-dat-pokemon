"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Importing the Button component
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // Importing motion and AnimatePresence from Framer Motion

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
}

const MotionImage = motion(Image); // Create a MotionImage component

export default function Page() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [revealed, setRevealed] = useState<boolean>(false);

  const fetchRandomPokemon = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=1000`
    );
    const data = await response.json();
    const randomId = Math.floor(Math.random() * data.results.length) + 1; // Random ID based on the total number of Pokémon
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`
    );
    const pokemonData: Pokemon = await pokemonResponse.json();
    setPokemon(pokemonData);
    setLoading(false);
    setRevealed(false); // Reset reveal state when fetching new pokemon
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  return (
    <div className="relative h-full">
      <Image
        src="/who-dat.webp"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-[-1] opacity-50"
      />
      <AnimatePresence>
        <div className="flex flex-col items-center">
          {revealed && <h1 className="text-3xl font-bold">{pokemon?.name}</h1>}
          <div
            className={`w-96 h-96 ${
              revealed
                ? ""
                : "drop-shadow-[0px_1000px_0_black] translate-y-[-1000px]"
            }`}
          >
            <MotionImage
              src={pokemon?.sprites.front_default || ""}
              alt={pokemon?.name || ""}
              priority={true}
              width={300}
              height={300}
              initial={{ scale: 360 }}
              animate={
                revealed
                  ? { rotate: 0, scale: 1, y: [0, -10, 0] }
                  : { scale: 1 }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            />
          </div>
          <div className="mt-4">
            <Button onClick={() => setRevealed(true)} className="mr-2">
              Reveal Pokémon
            </Button>
            <Button onClick={fetchRandomPokemon} variant="secondary">
              Randomize Pokémon
            </Button>
          </div>
        </div>
      </AnimatePresence>
    </div>
  );
}
