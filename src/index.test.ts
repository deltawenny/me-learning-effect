import { afterAll, afterEach, beforeAll, expect, it } from "vitest";
import { server } from "../test/node";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

import { ConfigProvider, Effect, Layer, ManagedRuntime } from "effect";
import { PokeApi } from "./PokeApi";
import { makePokemon } from "../test/handlers";

const TestConfigProvider = ConfigProvider.fromMap(
  new Map([["BASE_URL", "http://localhost:3000"]]),
);

const ConfigProviderLayer = Layer.setConfigProvider(TestConfigProvider);
const MainLayer = PokeApi.Live.pipe(Layer.provide(ConfigProviderLayer));
const TestingRuntime = ManagedRuntime.make(MainLayer);

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
});

const main = program.pipe(Effect.provide(MainLayer));

it("returns a valid pokemon", async () => {
  const response = await TestingRuntime.runPromise(main);

  expect(response).toEqual(makePokemon);
});
