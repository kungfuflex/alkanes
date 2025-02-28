import { IProvider } from "./abstract-provider";
export declare abstract class AbstractSigner {
    abstract get provider(): IProvider;
    abstract signPsbt(hex: string): Promise<any>;
    abstract signMessage(hex: string): Promise<any>;
}
