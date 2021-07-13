interface Auth {
  userId?: string
}

declare namespace Express {
  export interface Request {
    auth?: Auth
  }
}
