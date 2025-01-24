export interface ILoginResponse {
  status: string;
  data: { token: string; role: string };
}
