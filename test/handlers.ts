import { Pokemon } from "../src/schemas";
import { http, HttpResponse } from "msw";

export const makePokemon = {
    height: 10,
    weight: 10,
    id: 1,
    name: "mock-pokemon",
    order: 1,
};

const mockPokemon = new Pokemon(makePokemon);

export const handlers = [
    http.get("http://localhost:3000/api/v2/pokemon/*", () => {
        return HttpResponse.json(mockPokemon);
    }),
];
