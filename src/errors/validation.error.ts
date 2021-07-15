import WisdoApiError from "./wisedoApi.error";

export default class ValidationError extends WisdoApiError {
  private field: string;
  constructor(field:string, message?:string) {
    if(!message) {
      message = `Invalid ${field} received`
    }
    super(message);
    this.field = field
    this.name = "ValidationError"
  }
}
