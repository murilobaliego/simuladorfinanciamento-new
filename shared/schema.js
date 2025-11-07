import { pgTable, text, serial, integer, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// Esquema para usuários (mantido do modelo original)
export var users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
});
export var insertUserSchema = createInsertSchema(users).pick({
    username: true,
    password: true,
});
// Esquema para os dados de cálculo de financiamento
export var calculatorSchema = z.object({
    valorFinanciado: z.number().positive("O valor financiado deve ser positivo"),
    taxaJuros: z.number().positive("A taxa de juros deve ser positiva"),
    numParcelas: z.number().int().positive("O número de parcelas deve ser um inteiro positivo"),
});
// Tabela para armazenar simulações (caso queira implementar salvamento de simulações no futuro)
export var simulacoes = pgTable("simulacoes", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(function () { return users.id; }),
    tipo: text("tipo").notNull(), // 'veiculo', 'imobiliario', 'pessoal', 'consignado'
    valorFinanciado: numeric("valor_financiado", { precision: 10, scale: 2 }).notNull(),
    taxaJuros: numeric("taxa_juros", { precision: 5, scale: 2 }).notNull(),
    numParcelas: integer("num_parcelas").notNull(),
    valorParcela: numeric("valor_parcela", { precision: 10, scale: 2 }).notNull(),
    totalPagar: numeric("total_pagar", { precision: 12, scale: 2 }).notNull(),
    totalJuros: numeric("total_juros", { precision: 12, scale: 2 }).notNull(),
    dataCriacao: text("data_criacao").notNull(),
    dadosAdicionais: jsonb("dados_adicionais"), // Para armazenar dados específicos de cada tipo de simulação
});
export var insertSimulacaoSchema = createInsertSchema(simulacoes).omit({
    id: true,
});
