export default {
  host: 'http://bibleapi.miguelnavarro.co',
  get: {
    bibles: '/versions',
    version: '/versions/:version',
    annotations: '/:version/annotations/:book/:chapter',
    annotation: '/:version/annotations/:book/:chapter/:verse',
    books: '/:version/books',
    chapter: '/:version/books/:book/:chapter',
    verse: '/:version/books/:book/:chapter/:verse'
  }
}
