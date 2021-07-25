type SuccessCallback = (result: any) => void;
type ErrorCallback = (error: error) => void;

type Callback = {
  success: SuccessCallback,
  error: ErrorCallback
}
