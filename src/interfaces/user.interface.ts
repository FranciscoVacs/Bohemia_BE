import type { IModel } from "./model.interface";

export interface IUserModel<T> extends IModel<T> {
  existsByEmail(email: string): Promise<boolean>;
}