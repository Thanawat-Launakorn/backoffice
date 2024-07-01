import axiosConfig from "@/app/axios";
import { DeleteProductRequest } from "@/app/models/request_body/deleteProductRequestBody";
import { atom } from "jotai";

export type DeleteProductAtomServiceReturnValue = {
  response_status: number;
};

class DeleteProductAtomService {
  private _responseError = atom<boolean>(false);

  public responseError = atom((get) => get(this._responseError));

  private _isLoading = atom<boolean>(false);

  public isLoading = atom((get) => get(this._isLoading));

  public fetchData = atom(
    null,
    async (_get, set, params: DeleteProductRequest) => {
      set(this._isLoading, true);
      set(this._responseError, false);
      let returnValue: DeleteProductAtomServiceReturnValue = {
        response_status: 0,
      };

      returnValue = await axiosConfig.ENDPOINT.delete(
        `product/delete/${params.id}`
      )
        .then((res) => {
          if (Number(res.status) === 200) {
            console.log("async res url:", res.config.url);
          } else if (Number(res.status) !== 200) {
            set(this._isLoading, false);
            set(this._responseError, true);
            returnValue = {
              response_status: res.status,
            };
            return returnValue;
          }

          set(this._isLoading, false);
          set(this._responseError, false);
          returnValue = {
            response_status: res.status,
          };
          return returnValue;
        })
        .catch((err) => {
          console.error("Error Fetch DeleteProductAtomService", err);
          set(this._isLoading, false);
          set(this._responseError, true);
          returnValue = {
            response_status: 0,
          };
          return returnValue;
        });
      return returnValue;
    }
  );
}

const deleteProductAtomService = new DeleteProductAtomService();

export default deleteProductAtomService;
