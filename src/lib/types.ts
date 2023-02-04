export interface SubscriptionPayload {
	/**
	 * The target is the *target's* key that client wants to **subscribe** to.
	 */
	readonly target: string;
	/**
	 * The timeZone is the client's timeZone according to [IANA](https://www.iana.org/time-zones)
	 */
	readonly timeZone: string;
	/**
	 * The subscription is the `PushSubscription` object from the client's browser.
	 */
	readonly subscription: PushSubscription;
}

export interface PushSubscription {
	/**
	 * The endpoint is the push services URL. To trigger a push message, make a POST request to this URL.
	 */
	readonly endpoint: string;
	/**
	 * The keys object contains the values used to encrypt message data sent with a push message.
	 */
	readonly keys: PushSubscriptionKey;
}

export interface PushSubscriptionKey {
	readonly p256dh: string;
	readonly auth: string;
}

export interface BirthdayTarget {
	name: string;
	date: number;
	month: number;
	year: number;
}

export interface NotificationPayload {
	readonly title: string;
	readonly body: string;
}

export interface State {
	disableInteraction: boolean;
	selectedKey: string;
	selectedTimeZone: string;
}
