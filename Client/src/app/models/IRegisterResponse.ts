export interface IRegisterResponse {
  status: string;
  data: { user: { id: string; name: string; email: string; role: string } };
}
