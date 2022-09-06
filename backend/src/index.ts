import { handle as handleFetch } from '~handler/fetch'
import { handle as handleScheduled } from '~handler/scheduled'

export default <ExportedHandler<Environment>>{
  fetch: handleFetch,
  scheduled: handleScheduled,
}
