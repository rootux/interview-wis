import WisdoApiError from "./wisedoApi.error"

export default class ValidationError extends WisdoApiError {
  private field: string|number
  private status: number
  constructor(field:string|number, message?:string) {
    if(!message) {
      message = `Invalid ${field} received`
    }
    super(message)
    this.field = field
    this.name = "ValidationError"
    this.status = 400
  }
}
