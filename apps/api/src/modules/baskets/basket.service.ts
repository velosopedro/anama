import { AppError } from "../../shared/errors/app-error.js";

import { basketRepository } from "./basket.repository.js";

import { BASE_BASKET_COMPOSITION } from "./basket.config.js";

import type { AidRequestInput } from "./basket.schema.js";

import { familyService } from "../families/family.service.js";

function serializeBasket(
  basket: Awaited<ReturnType<typeof basketRepository.findById>>,
  totalCollected: number,
) {
  if (!basket) {
    return null;
  }

  const estimatedValue = Number(basket.valorEstimado);

  const progress =
    estimatedValue > 0
      ? Math.min(100, (totalCollected / estimatedValue) * 100)
      : 0;

  return {
    idCesta: basket.idCesta,
    codigoFamilia: basket.familia.codigoPublico,

    status: basket.status,

    valorEstimado: estimatedValue,

    valorArrecadado: totalCollected,

    percentual: Number(progress.toFixed(2)),

    createdAt: basket.createdAt,

    itens: basket.itens.map((basketItem) => ({
      idItem: basketItem.item.idItem,

      nome: basketItem.item.nome,

      categoria: basketItem.item.categoria,

      valorMedio: Number(basketItem.item.valorMedio),

      quantidadeNecessaria: basketItem.quantidadeNecessaria,

      quantidadeArrecadada: basketItem.quantidadeArrecadada,
    })),
  };
}

export const basketService = {
  async listCatalog() {
    const items = await basketRepository.findCatalogItems();

    const baseNames = new Set(BASE_BASKET_COMPOSITION.map((item) => item.nome));

    return items.map((item) => ({
      idItem: item.idItem,
      nome: item.nome,
      categoria: item.categoria,

      valorMedio: Number(item.valorMedio),

      basico: baseNames.has(item.nome),
    }));
  },

  async createAidRequest(idUsuario: number, input: AidRequestInput) {
    const family = await familyService.validateAidRequest(idUsuario);

    const baseNames = BASE_BASKET_COMPOSITION.map((item) => item.nome);

    const baseItems = await basketRepository.findItemsByNames(baseNames);

    if (baseItems.length !== BASE_BASKET_COMPOSITION.length) {
      throw new AppError(
        "O catálogo da cesta padrão não está configurado corretamente.",
        500,
        "BASE_BASKET_NOT_CONFIGURED",
      );
    }

    const additionalIds = [
      ...new Set(input.itensAdicionais.map((item) => item.idItem)),
    ];

    const additionalItems =
      additionalIds.length > 0
        ? await basketRepository.findItemsByIds(additionalIds)
        : [];

    if (additionalItems.length !== additionalIds.length) {
      throw new AppError(
        "Um ou mais itens adicionais não existem no catálogo.",
        400,
        "INVALID_ADDITIONAL_ITEM",
      );
    }

    const composition = new Map<
      number,
      {
        idItem: number;
        quantidade: number;
        valorMedio: number;
      }
    >();

    for (const baseConfig of BASE_BASKET_COMPOSITION) {
      const item = baseItems.find(
        (catalogItem) => catalogItem.nome === baseConfig.nome,
      );

      if (!item) {
        throw new AppError(
          "Item obrigatório da cesta não encontrado.",
          500,
          "BASE_ITEM_NOT_FOUND",
        );
      }

      composition.set(item.idItem, {
        idItem: item.idItem,

        quantidade: baseConfig.quantidade,

        valorMedio: Number(item.valorMedio),
      });
    }

    for (const additional of input.itensAdicionais) {
      const item = additionalItems.find(
        (catalogItem) => catalogItem.idItem === additional.idItem,
      );

      if (!item) {
        throw new AppError(
          "Item adicional inválido.",
          400,
          "INVALID_ADDITIONAL_ITEM",
        );
      }

      const existing = composition.get(item.idItem);

      if (existing) {
        existing.quantidade += additional.quantidade;

        continue;
      }

      composition.set(item.idItem, {
        idItem: item.idItem,

        quantidade: additional.quantidade,

        valorMedio: Number(item.valorMedio),
      });
    }

    const compositionItems = [...composition.values()];

    const totalInCents = compositionItems.reduce((total, item) => {
      const unitPriceInCents = Math.round(item.valorMedio * 100);

      return total + unitPriceInCents * item.quantidade;
    }, 0);

    const valorEstimado = totalInCents / 100;

    const basket = await basketRepository.createAidBasket(
      family.idFamilia,
      valorEstimado,

      compositionItems.map((item) => ({
        idItem: item.idItem,

        quantidadeNecessaria: item.quantidade,
      })),
    );

    return serializeBasket(basket, 0);
  },

  async listActive() {
    const baskets = await basketRepository.findActive();

    return Promise.all(
      baskets.map(async (basket) => {
        const donations = await basketRepository.sumConfirmedDonations(
          basket.idCesta,
        );

        const total = Number(donations._sum.valorTotal ?? 0);

        return serializeBasket(basket, total);
      }),
    );
  },

  async getById(idCesta: number) {
    const basket = await basketRepository.findById(idCesta);

    if (!basket) {
      throw new AppError("Cesta não encontrada.", 404, "BASKET_NOT_FOUND");
    }

    const donations = await basketRepository.sumConfirmedDonations(idCesta);

    const total = Number(donations._sum.valorTotal ?? 0);

    return serializeBasket(basket, total);
  },
};
