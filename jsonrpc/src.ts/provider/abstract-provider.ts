export interface IProvider {
  call(method: string, params: any[]): Promise<any>;
}

export abstract class AbstractProvider implements IProvider {
  abstract call(method: string, params: any[]): Promise<any>;
}
