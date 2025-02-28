export interface IProvider {
    call(method: string, params: any[]): Promise<any>;
}
export declare abstract class AbstractProvider implements IProvider {
    abstract call(method: string, params: any[]): Promise<any>;
}
