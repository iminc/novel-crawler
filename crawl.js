const fs = require('fs')
const ora = require('ora')
const { HOST, getHtml } = require('./util')

async function getBooks({ name, link, spinner, data = [] }) {
    const $ = await getHtml(link)

    $('section .list-lastupdate li').each((i, el) => {
        const $el = $(el)

        data.push({
            type: $el.find('.class').html(),
            name: $el.find('.name a').eq(0).html(),
            author: $el.find('.other').html().replace(/[\s\S]?<small>[\s\S]?.*[\s\S]?<\/small>[\s\S]?/, ''),
            link: $el.find('.name a').eq(0).attr('href'),
            latestChapter: $el.find('.name a').eq(1).html(),
            latestChapterLink: $el.find('.name a').eq(0).attr('href'),
            lastUpdateTime: '20' + $el.find('.other small').html()
        })

        spinner.text = spinner.text.replace(/\d+/, `${data.length}`)
    })

    const $next = $('.pages a.next')
    if ($next.length > 0) {
        await getBooks({
            name,
            data,
            spinner,
            link: $next.attr('href')
        })
    }

    return data
}

(async () => {
    const path = './src/index.json'
    const version = JSON.parse(fs.readFileSync(path).toString())
    const today = new Date().setHours(0, 0, 0, 0)

    for (let type of version.types) {
        if (type.lastUpdateTime === today) {
            continue
        }

        const spinner = ora(` 爬取『 ${type.name} 』共 0 本`).start()
        const startTime = Date.now()
        try {
            const books = await getBooks({ name: type.name, link: type.link, spinner })
            fs.writeFileSync(`./src/${type.name}/data.json`, JSON.stringify(books, null, 4))
            type.lastUpdateTime = today

            spinner.text = `${spinner.text}, 耗时 ${((Date.now() - startTime) / 1000).toFixed(2)}s`
            spinner.succeed()
        } catch (e) {
            spinner.text = `${spinner.text}, 耗时 ${((Date.now() - startTime) / 1000).toFixed(2)}s`
            spinner.fail()
            console.error(e)
        }
    }

    version.lastUpdateTime = Date.now()
    fs.writeFileSync(path, JSON.stringify(version, null, 4))
})()
