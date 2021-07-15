export default class WisdoApiError extends Error {
  constructor(message?:string) {
    super(message);
    this.name = "WisdoApiError"
  }
}
