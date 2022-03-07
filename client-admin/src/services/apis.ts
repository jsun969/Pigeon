import service from './axios';

export type LoginBody = { key: string };
export type LoginResponse = { token: string };
export type TotalCount = { total: number };
export type InviteCode = {
  _id: string;
  username: string | null;
  updatedAt: string;
};
export type GetInviteCodesResponse = { data: InviteCode[] } & TotalCount;
export type GenerateInviteCodeBody = { count: number };
export type Message = {
  _id: string;
  time: string;
  fullName: string;
  username: string;
  devices: { code: string }[];
  message: string;
};
export type GetMessagesResponse = { data: Message[] } & TotalCount;

export default class API {
  static async login(body: LoginBody) {
    return await service.post<LoginResponse>('/login', body);
  }
  static async init() {
    return await service.get('/init');
  }
  static async getInviteCodes(
    take: number,
    skip: number,
    used?: 'true' | 'false' | null,
  ) {
    return await service.get<GetInviteCodesResponse>('/invite-codes', {
      params: { take, skip, used },
    });
  }
  static async generateInviteCodes(body: GenerateInviteCodeBody) {
    return await service.post<string[]>('invite-codes', body);
  }
  static async getMessages(
    take: number,
    skip: number,
    username?: string,
    code?: string,
  ) {
    return await service.get<GetMessagesResponse>('/messages', {
      params: { take, skip, username, code },
    });
  }
}
