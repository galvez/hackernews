// =================================================
// State
// =================================================
import { validFeeds } from '~/common/api'

export default () => {
  const s = {
    items: {
      /* [id: number]: Item */
    },
    users: {
      /* [id: string]: User */
    },
    feeds: {
      /* [page: number] : [ [id: number] ] */
    }
  }

  validFeeds.forEach((feed) => {
    s.feeds[feed] = {}
  })

  return s
}
