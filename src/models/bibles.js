import Api from '../Api'

export class Bibles {
  constructor () {
    this.api = new Api()
    this.all = []
  }

  fetch () {
    return this.api.get('bibles')
      .then((res) => (this.all = res))
  }
}
