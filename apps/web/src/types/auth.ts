export type UserRole = "DOADOR" | "FAMILIA" | "ONG" | "ADMIN";

export interface FamilyProfile {
  idFamilia: number;
  codigoPublico: string;
  numeroIntegrantes: number;
  status: string;
}

export interface OrganizationProfile {
  idOng: number;
  cnpj: string;
  nomeFantasia: string;
  statusVerificacao: string;
}

export interface AuthUser {
  idUsuario: number;
  nome: string;
  email: string;
  tipo: UserRole;
  status: string;

  familia: FamilyProfile | null;
  ong: OrganizationProfile | null;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterDonorInput {
  tipo: "DOADOR";
  nome: string;
  email: string;
  senha: string;
}

export interface RegisterFamilyInput {
  tipo: "FAMILIA";
  nome: string;
  email: string;
  senha: string;
  numeroIntegrantes: number;
}

export interface RegisterOrganizationInput {
  tipo: "ONG";
  nome: string;
  email: string;
  senha: string;
  nomeFantasia: string;
  cnpj: string;
}

export type RegisterInput =
  | RegisterDonorInput
  | RegisterFamilyInput
  | RegisterOrganizationInput;
