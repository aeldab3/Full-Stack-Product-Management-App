export interface IloginResponse {
  status: string;
  data: { token: string; role: string };
}
