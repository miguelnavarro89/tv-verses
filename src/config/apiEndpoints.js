export default {
  host: 'http://bibleapi.miguelnavarro.co',
  get: {
    bibles: '/versions',
    books: '/:version/books',
    version: '/versions/:version',
    annotations: '/:version/annotations/:book/:chapter',
    annotation: '/:version/annotations/:book/:chapter/:verse',
    chapter: '/:version/books/:book/:chapter',
    verse: '/:version/books/:book/:chapter/:verse',
    totalChapters: '/:version/books/:book/total',
    totalVerses: '/:version/books/:book/:chapter/total'
  }
}
