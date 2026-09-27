export interface CatalogItemConfig {
  nome: string;
  categoria: string;
  valorMedio: number;
}

export interface BaseBasketItemConfig {
  nome: string;
  quantidade: number;
}

/**
 * Valores usados apenas no ambiente de desenvolvimento
 * para permitir o cálculo e demonstração do valor estimado.
 *
 * Não representam tabela oficial de preços.
 */
export const DEVELOPMENT_CATALOG: CatalogItemConfig[] = [
  {
    nome: "Arroz 1 kg",
    categoria: "Cereais",
    valorMedio: 7.0,
  },
  {
    nome: "Feijão 1 kg",
    categoria: "Leguminosas",
    valorMedio: 9.0,
  },
  {
    nome: "Macarrão 500 g",
    categoria: "Cereais",
    valorMedio: 4.5,
  },
  {
    nome: "Farinha de trigo 1 kg",
    categoria: "Cereais",
    valorMedio: 6.0,
  },
  {
    nome: "Farinha de mandioca 1 kg",
    categoria: "Raízes e tubérculos",
    valorMedio: 8.0,
  },
  {
    nome: "Óleo vegetal 900 ml",
    categoria: "Óleos e gorduras",
    valorMedio: 8.0,
  },
  {
    nome: "Leite UHT 1 L",
    categoria: "Leites e queijos",
    valorMedio: 6.0,
  },
  {
    nome: "Açúcar 1 kg",
    categoria: "Açúcares",
    valorMedio: 5.0,
  },
  {
    nome: "Sal 1 kg",
    categoria: "Sal",
    valorMedio: 3.0,
  },
  {
    nome: "Café 500 g",
    categoria: "Café e especiarias",
    valorMedio: 18.0,
  },

  // Itens adicionais
  {
    nome: "Aveia 500 g",
    categoria: "Cereais",
    valorMedio: 7.0,
  },
  {
    nome: "Lentilha 500 g",
    categoria: "Leguminosas",
    valorMedio: 8.0,
  },
  {
    nome: "Leite em pó 400 g",
    categoria: "Leites e queijos",
    valorMedio: 17.0,
  },
  {
    nome: "Sardinha em lata 125 g",
    categoria: "Carnes e ovos",
    valorMedio: 7.0,
  },
  {
    nome: "Farinha de milho 1 kg",
    categoria: "Cereais",
    valorMedio: 6.0,
  },
  {
    nome: "Ovos - dúzia",
    categoria: "Carnes e ovos",
    valorMedio: 14.0,
  },
];

export const BASE_BASKET_COMPOSITION: BaseBasketItemConfig[] = [
  {
    nome: "Arroz 1 kg",
    quantidade: 5,
  },
  {
    nome: "Feijão 1 kg",
    quantidade: 2,
  },
  {
    nome: "Macarrão 500 g",
    quantidade: 2,
  },
  {
    nome: "Farinha de trigo 1 kg",
    quantidade: 1,
  },
  {
    nome: "Farinha de mandioca 1 kg",
    quantidade: 1,
  },
  {
    nome: "Óleo vegetal 900 ml",
    quantidade: 2,
  },
  {
    nome: "Leite UHT 1 L",
    quantidade: 2,
  },
  {
    nome: "Açúcar 1 kg",
    quantidade: 1,
  },
  {
    nome: "Sal 1 kg",
    quantidade: 1,
  },
  {
    nome: "Café 500 g",
    quantidade: 1,
  },
];
