/**
 * Fredoka (400 e 600) empacotada localmente via @fontsource — funciona offline e no render.
 * A renderização só começa depois que as fontes estiverem carregadas.
 */
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/600.css";
import { continueRender, delayRender } from "remotion";
import { fontes } from "./tokens";

let carregado = false;

export const carregarFontes = () => {
  if (carregado || typeof document === "undefined") return;
  carregado = true;
  const handle = delayRender("Carregando fontes Animamente");
  const pedidos = Object.values(fontes).map((f) =>
    document.fonts.load(`${f.peso} 40px "${f.familia}"`, "AaÁçãé0123·→"),
  );
  Promise.all(pedidos)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
