import WisdoApiError from "./wisedoApi.error"

export default class AuthError extends WisdoApiError {
  private status: number
  constructor(message?:string) {
    if(!message) {
      message = "You don't have permission for this Or authorization is invalid"
    }
    super(message)
    this.status = 401
  }
}
