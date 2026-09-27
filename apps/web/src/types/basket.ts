export interface BasketItem {
  idItem: number;
  nome: string;
  categoria: string;
  valorMedio: number;
  quantidadeNecessaria: number;
  quantidadeArrecadada: number;
}

export interface Basket {
  idCesta: number;
  codigoFamilia: string;
  status: string;

  valorEstimado: number;
  valorArrecadado: number;
  percentual: number;

  createdAt: string;

  itens: BasketItem[];
}

export interface BasketListResponse {
  baskets: Basket[];
}

export interface BasketResponse {
  basket: Basket;
}

export interface CatalogItem {
  idItem: number;
  nome: string;
  categoria: string;
  valorMedio: number;
  basico: boolean;
  quantidadePadrao: number;
}

export interface CatalogResponse {
  items: CatalogItem[];
}

export interface AdditionalItemInput {
  idItem: number;
  quantidade: number;
}

export interface CreateAidRequestResponse {
  basket: Basket;
}
