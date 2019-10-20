import { $set } from 'vue-stator'
import { CancelToken } from 'axios'
import { lazy } from '~/common/utils'

// =================================================
// Actions
// =================================================
export function fetchFeed({ $axios }, state, { feed, page, prefetch }) {
  // Don't priorotize already fetched feeds
  if (state.feeds[feed][page] && state.feeds[feed][page].length) {
    prefetch = true
  }
  if (!prefetch) {
    if (this.feedCancelSource) {
      this.feedCancelSource.cancel(
        'priorotize feed: ' + feed + ' page: ' + page
      )
    }
    this.feedCancelSource = CancelToken.source()
  }
  return lazy(
    (items) => {
      const ids = items.map(item => item.id)
      $set(state.feeds[feed], page, ids)
      for (const item of items) {
        if (item) {
          $set(state.items, item.id, item)
        }
      }
    },
    () =>
      $axios.$get(`/${feed}?page=${page}`, {
        cancelToken: this.feedCancelSource && this.feedCancelSource.token
      }),
    (state.feeds[feed][page] || []).map(id => state.items[id])
  )
}

export function fetchItem({ $axios }, state, { id }) {
  return lazy(
    (item) => {
      if (item) {
        $set(state.items, item.id, item)
      }
    },
    () => $axios.$get(`/item/${id}`),
    Object.assign({ id, loading: true, comments: [] }, state.items[id])
  )
}

export function fetchUser({ $axios }, state, { id }) {
  return lazy(
    user => $set(state.users, id, user || false), /* false means user not found */
    () => $axios.$get(`/user/${id}`),
    Object.assign({ id, loading: true }, state.users[id])
  )
}
