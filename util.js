const cheerio = require('cheerio')
const request = require('superagent')
require('superagent-charset')(request)

const HOST = 'www.uctxt.com'
function getHtml(url = '/') {
    return new Promise((resolve, reject) => {
        request
            .get(HOST + url)
            .charset()
            .set({
                'host': HOST,
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
            })
            .end((err, res) => {
                err ? reject(err) : resolve(cheerio.load(res.text, { decodeEntities: false }))
            })
    })
}

module.exports = {
    HOST,
    getHtml
}