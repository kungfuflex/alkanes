import { IProvider } from "./abstract-provider";
import { AbstractSigner } from "./abstract-signer";
export declare class Signer extends AbstractSigner {
    _provider: IProvider;
    _target: Signer;
    static from(signer: Signer): Signer;
    connect(provider: IProvider): Signer;
    constructor(signer: Signer, provider: IProvider);
    get provider(): IProvider;
    signPsbt(...args: any[]): Promise<any>;
    signMessage(...args: any[]): Promise<any>;
}
