import { IProvider } from "./abstract-provider";
import { AbstractSigner } from "./abstract-signer";
export class Signer extends AbstractSigner {
  public _provider: IProvider;
  public _target: Signer;
  static from(signer: Signer): Signer {
    return new this(signer, null as unknown as IProvider);
  }
  connect(provider: IProvider): Signer {
    return new ((this as any).constructor)(this._target, provider) as Signer;
  }
  constructor(signer: Signer, provider: IProvider) {
    super();
    this._target = signer;
    this._provider = provider;
  }
  get provider(): IProvider {
    return this._provider;
  }
  async signPsbt(...args: any[]): Promise<any> {
    return await this._target.signPsbt(...args);
  }
  async signMessage(...args: any[]): Promise<any> {
    return await this._target.signMessage(...args);
  }
}
