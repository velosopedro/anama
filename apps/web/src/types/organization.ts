export interface OrganizationResponsible {
  idUsuario: number;
  nome: string;
  email: string;
  status: string;
}

export interface PendingOrganization {
  idOng: number;
  cnpj: string;
  nomeFantasia: string;
  statusVerificacao: string;
  responsavel: OrganizationResponsible;
}

export interface PendingOrganizationsResponse {
  organizations: PendingOrganization[];
}

export interface OrganizationResponse {
  organization: PendingOrganization;
}
