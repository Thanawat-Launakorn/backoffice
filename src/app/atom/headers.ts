import { atom } from "jotai";

export type HeadersProps = {
  id_token: string;
  "content-type": "application/json";
};

class HeaderAtomService {
  initHeaders: HeadersProps = {
    id_token: "",
    "content-type": "application/json",
  };

  private headerAtom = atom(this.initHeaders);

  public getHeader = atom((get) => get(this.headerAtom));

  private _isLoading = atom(false);

  public isLoading = atom((get) => get(this._isLoading));

  public setHeader = atom(null, async (_get, set, accessToken: string) => {
    set(this._isLoading, true);
    const newHeader: HeadersProps = {
      id_token: accessToken,
      "content-type": "application/json",
    };

    set(this.headerAtom, newHeader);
    return newHeader
  });
}

const headerAtomService = new HeaderAtomService();

export default headerAtomService;



