-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "familia" (
    "id_familia" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "codigo_publico" UUID NOT NULL,
    "numero_integrantes" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ATIVA',

    CONSTRAINT "familia_pkey" PRIMARY KEY ("id_familia")
);

-- CreateTable
CREATE TABLE "ong" (
    "id_ong" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "cnpj" VARCHAR(18) NOT NULL,
    "nome_fantasia" VARCHAR(120) NOT NULL,
    "status_verificacao" VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "ong_pkey" PRIMARY KEY ("id_ong")
);

-- CreateTable
CREATE TABLE "endereco_familia" (
    "id_endereco" SERIAL NOT NULL,
    "id_familia" INTEGER NOT NULL,
    "endereco_protegido" TEXT NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),

    CONSTRAINT "endereco_familia_pkey" PRIMARY KEY ("id_endereco")
);

-- CreateTable
CREATE TABLE "cesta" (
    "id_cesta" SERIAL NOT NULL,
    "id_familia" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'EM_MONTAGEM',
    "valor_estimado" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cesta_pkey" PRIMARY KEY ("id_cesta")
);

-- CreateTable
CREATE TABLE "item" (
    "id_item" SERIAL NOT NULL,
    "nome" VARCHAR(80) NOT NULL,
    "categoria" VARCHAR(50) NOT NULL,
    "valor_medio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id_item")
);

-- CreateTable
CREATE TABLE "cesta_item" (
    "id_cesta" INTEGER NOT NULL,
    "id_item" INTEGER NOT NULL,
    "quantidade_necessaria" INTEGER NOT NULL,
    "quantidade_arrecadada" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cesta_item_pkey" PRIMARY KEY ("id_cesta","id_item")
);

-- CreateTable
CREATE TABLE "doacao" (
    "id_doacao" SERIAL NOT NULL,
    "id_doador" INTEGER NOT NULL,
    "id_cesta" INTEGER NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    "valor_total" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doacao_pkey" PRIMARY KEY ("id_doacao")
);

-- CreateTable
CREATE TABLE "doacao_item" (
    "id_doacao_item" SERIAL NOT NULL,
    "id_doacao" INTEGER NOT NULL,
    "id_item" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "doacao_item_pkey" PRIMARY KEY ("id_doacao_item")
);

-- CreateTable
CREATE TABLE "pagamento" (
    "id_pagamento" SERIAL NOT NULL,
    "id_doacao" INTEGER NOT NULL,
    "gateway" VARCHAR(40) NOT NULL,
    "transaction_id" VARCHAR(120),
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    "valor" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "pagamento_pkey" PRIMARY KEY ("id_pagamento")
);

-- CreateTable
CREATE TABLE "estoque_ong" (
    "id_ong" INTEGER NOT NULL,
    "id_item" INTEGER NOT NULL,
    "quantidade_disponivel" INTEGER NOT NULL DEFAULT 0,
    "quantidade_reservada" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "estoque_ong_pkey" PRIMARY KEY ("id_ong","id_item")
);

-- CreateTable
CREATE TABLE "entrega" (
    "id_entrega" SERIAL NOT NULL,
    "id_ong" INTEGER NOT NULL,
    "id_cesta" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    "data_agendada" TIMESTAMP(6) NOT NULL,
    "rota_referencia" TEXT,

    CONSTRAINT "entrega_pkey" PRIMARY KEY ("id_entrega")
);

-- CreateTable
CREATE TABLE "notificacao" (
    "id_notificacao" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo" VARCHAR(40) NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notificacao_pkey" PRIMARY KEY ("id_notificacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "familia_id_usuario_key" ON "familia"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "familia_codigo_publico_key" ON "familia"("codigo_publico");

-- CreateIndex
CREATE UNIQUE INDEX "ong_id_usuario_key" ON "ong"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "ong_cnpj_key" ON "ong"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "endereco_familia_id_familia_key" ON "endereco_familia"("id_familia");

-- CreateIndex
CREATE UNIQUE INDEX "pagamento_transaction_id_key" ON "pagamento"("transaction_id");

-- Garante no máximo um pagamento APROVADO por doação
CREATE UNIQUE INDEX "uq_pagamento_aprovado_por_doacao"
ON "pagamento" ("id_doacao")
WHERE "status" = 'APROVADO';

-- CreateIndex
CREATE UNIQUE INDEX "entrega_id_cesta_key" ON "entrega"("id_cesta");

-- AddForeignKey
ALTER TABLE "familia" ADD CONSTRAINT "familia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ong" ADD CONSTRAINT "ong_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco_familia" ADD CONSTRAINT "endereco_familia_id_familia_fkey" FOREIGN KEY ("id_familia") REFERENCES "familia"("id_familia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cesta" ADD CONSTRAINT "cesta_id_familia_fkey" FOREIGN KEY ("id_familia") REFERENCES "familia"("id_familia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cesta_item" ADD CONSTRAINT "cesta_item_id_cesta_fkey" FOREIGN KEY ("id_cesta") REFERENCES "cesta"("id_cesta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cesta_item" ADD CONSTRAINT "cesta_item_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao" ADD CONSTRAINT "doacao_id_doador_fkey" FOREIGN KEY ("id_doador") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao" ADD CONSTRAINT "doacao_id_cesta_fkey" FOREIGN KEY ("id_cesta") REFERENCES "cesta"("id_cesta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao_item" ADD CONSTRAINT "doacao_item_id_doacao_fkey" FOREIGN KEY ("id_doacao") REFERENCES "doacao"("id_doacao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao_item" ADD CONSTRAINT "doacao_item_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamento" ADD CONSTRAINT "pagamento_id_doacao_fkey" FOREIGN KEY ("id_doacao") REFERENCES "doacao"("id_doacao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque_ong" ADD CONSTRAINT "estoque_ong_id_ong_fkey" FOREIGN KEY ("id_ong") REFERENCES "ong"("id_ong") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque_ong" ADD CONSTRAINT "estoque_ong_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrega" ADD CONSTRAINT "entrega_id_ong_fkey" FOREIGN KEY ("id_ong") REFERENCES "ong"("id_ong") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrega" ADD CONSTRAINT "entrega_id_cesta_fkey" FOREIGN KEY ("id_cesta") REFERENCES "cesta"("id_cesta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;


-- =========================================================
-- CHECK CONSTRAINTS DOCUMENTADOS NO ANAMÃ
-- =========================================================

ALTER TABLE "usuario"
ADD CONSTRAINT "usuario_tipo_check"
CHECK ("tipo" IN ('DOADOR', 'FAMILIA', 'ONG', 'ADMIN'));

ALTER TABLE "usuario"
ADD CONSTRAINT "usuario_status_check"
CHECK ("status" IN ('ATIVO', 'BLOQUEADO', 'PENDENTE'));


ALTER TABLE "familia"
ADD CONSTRAINT "familia_numero_integrantes_check"
CHECK ("numero_integrantes" > 0);

ALTER TABLE "familia"
ADD CONSTRAINT "familia_status_check"
CHECK ("status" IN ('ATIVA', 'INATIVA'));