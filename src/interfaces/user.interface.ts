import type { IModel } from "./model.interface";

export interface IUserModel<T> extends IModel<T> {
  getByEmail(email: string): Promise<T | null>;
}