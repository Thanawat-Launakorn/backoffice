export type LoginResponse = {
  response_status: number;
  access_token: string;
  response: response;
};

type response = {
  errorDetails: {
    errorDesc_TH: string;
    errorDesc_EN: string;
  };
};
