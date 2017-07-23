const fs = require('fs')
const path = require('path')
const shortid = require('shortid')
const { HOST, getHtml } = require('./util')

!(async () => {
    console.time('init time')

    const $ = await getHtml()

    const data = {
        host: HOST,
        title: $('title').html(),
        lastUpdateTimestamp: Date.now(),
        dirs: []
    }

    $('nav a').slice(1, 11).each((i, el) => {
        const name = $(el).html()
        const link = $(el).attr('href')
        const folder = `./src/${name}`
        !fs.existsSync(folder) && fs.mkdir(folder, err => { throw err })

        data.dirs.push({ name, link })
    })

    fs.writeFileSync('./src/index.html', $.html())
    fs.writeFileSync('./src/index.json', JSON.stringify(data, null, 4))

    console.timeEnd('init time')
})()