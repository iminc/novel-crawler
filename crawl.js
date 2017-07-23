const fs = require('fs')
const path = require('path')
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
        
        spinner.text = spinner.text.replace(/\d+/, data.length)
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
    let list = JSON.parse(fs.readFileSync('./src/index.json').toString())

    for (let dir of list.dirs) {
        const spinner = ora(` 爬取『 ${dir.name} 』共 0 本.`).start()
        try {
            const books = await getBooks({
                name: dir.name,
                link: dir.link,
                spinner
            })
            fs.writeFileSync(`./src/${dir.name}/data.json`, JSON.stringify(books, null, 4))
            spinner.succeed()
        } catch (e) {
            spinner.fail()
            throw e
        }
    }
})()