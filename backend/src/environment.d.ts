interface Environment {
  BIRTHDAY_SUBSCRIPTIONS: KVNamespace
  NOTIFICATION_TITLE: string
  SERVER_JWK: string
  SERVER_JWT_SUB: string
}

interface BirthdaySubscriptionMetadata {
  timeZone: string
}
