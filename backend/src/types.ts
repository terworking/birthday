export interface ExtendedRequest extends Request {
  subscription: {
    body: PushSubscription
    key: string
    timeZone: string
  }
}
