"use strict";

/**
 * Dados editáveis dos produtos. Os preços abaixo são demonstrativos.
 * @typedef {Object} Flavor
 * @property {"zero-sugar" | "ultra-fiesta-mango" | "ultra-white"} id
 * @property {string} eyebrow
 * @property {string} name
 * @property {string} shortName
 * @property {string} description
 * @property {string} detail
 * @property {number} price
 * @property {{background: string, light: string, accent: string, accentSoft: string, particleColors: [string, string, string]}} palette
 */

/** @type {readonly Flavor[]} */
window.MONSTER_FLAVORS = Object.freeze([
  {
    id: "zero-sugar",
    eyebrow: "Unleash the beast",
    name: "Monster Energy Zero Sugar",
    shortName: "Zero Sugar",
    description: "O sabor clássico de Monster Energy em uma versão sem açúcar.",
    detail: "Lata preta · detalhes verde neon",
    price: 12.9,
    palette: {
      background: "#020504",
      light: "#70f20d",
      accent: "#8bf21b",
      accentSoft: "#356b12",
      particleColors: ["#b6ff42", "#69f50b", "#2e9a10"],
    },
  },
  {
    id: "ultra-white",
    eyebrow: "Zero sugar · Ultra",
    name: "Monster Ultra White",
    shortName: "Ultra White",
    description: "Perfil cítrico e refrescante com a identidade da linha Monster Ultra.",
    detail: "Lata branca · detalhes prateados",
    price: 12.9,
    palette: {
      background: "#070a0b",
      light: "#e6fbff",
      accent: "#eafcff",
      accentSoft: "#789aa5",
      particleColors: ["#ffffff", "#c7eef4", "#8eb8c2"],
    },
  },
  {
    id: "ultra-fiesta-mango",
    eyebrow: "Zero sugar · Ultra",
    name: "Monster Ultra Fiesta Mango",
    shortName: "Fiesta Mango",
    description: "Perfil tropical de manga, com a identidade leve da linha Monster Ultra.",
    detail: "Lata azul-turquesa · detalhes laranja",
    price: 12.9,
    palette: {
      background: "#040606",
      light: "#ff7a18",
      accent: "#ff9a28",
      accentSoft: "#087e83",
      particleColors: ["#ffc257", "#ff7417", "#26c9c7"],
    },
  },
]);

window.formatMonsterPrice = function formatMonsterPrice(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
};
