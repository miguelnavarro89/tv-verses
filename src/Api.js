import { forEachObjIndexed, replace } from 'ramda'
import apiEndpoints from './config/apiEndpoints'

export default class Api {
  constructor () {
    this.host = apiEndpoints.host
    this.params = {}
  }

  request (method, endpointId) {
    let endpoint = apiEndpoints[method][endpointId]
    const transformEndpointBy = forEachObjIndexed((v, k, obj) => {
      endpoint = replace(`:${String(k)}`, v, endpoint)
    })
    transformEndpointBy(this.params)
    const url = this.host + endpoint
    const request = new Request(url, {method})
    return fetch(request).then((res) => res.json())
  }

  get (endpointId) {
    return this.request('get', endpointId)
  }

  with (params) {
    this.params = params
    return this
  }
}
