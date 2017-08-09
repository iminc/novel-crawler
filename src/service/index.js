const fs = require('fs')
const ora = require('ora')
const cheerio = require('cheerio')
const request = require('superagent')
require('superagent-charset')(request)

const { site: { host, userAgent } } = require('../config')
const { Type, Novel } = require('../models')

class Service {
    constructor() {
        this.novels = 0
    }

    async get(url = '/') {
        const html = await new Promise((resolve, reject) => {
            request
                .get(host + url)
                .set({ host, userAgent })
                // @ts-ignore
                .charset()
                .end((err, res) => {
                    err ? reject(err) : resolve(res.text)
                })
        })
        return cheerio.load(html, { decodeEntities: false })
    }

    async getNovel(url, props = {}) {
        const $ = await this.get(url)
        
        const chapters = []
        $('.chapter-list a').each((i, el) => {
            chapters.push({
                serial: i,
                name: $(el).html(),
                link: url + $(el).attr('href')
            })
        })

        return Object.assign({
            link: url,
            name: $('.book-info .l h1').html(),
            author: $('.book-info .l em').html().replace(/.*[:：]/, ''),
            status: $('.stats .r i').eq(0).html(),
            intro: $('.intro').html().replace(/(<\w>)?.*<\/?\w+>/g, '').trim(),
            words: $('.stats .r i').eq(1).html(),
            chapters, 
        }, props)
    }

    async init() {
        const types = await this.findTypes()
        if (types.length > 0) {
            return types
        }

        const spinner = ora(` 收录『 UC书盟小说 』共 0 类`).start()
        const startTime = Date.now()

        try {
            const $ = await this.get()
            const $types = $('nav a').slice(1, 11).map((i, el) => el).get()

            for (let el of $types) {
                const name = $(el).html()
                const link = $(el).attr('href')
                await new Type({
                    name,
                    link,
                    lastCrawlPage: link,
                    lastUpdateTime: Date.now()
                }).save()

                spinner.text = spinner.text.replace(/\d+/, `${$(el).index() + 1}`)
            }

            spinner.text = `${spinner.text}, 耗时 ${((Date.now() - startTime) / 1000).toFixed(2)}s.`
            spinner.succeed()
            return await this.findTypes()
        } catch (e) {
            spinner.text = `${spinner.text}, 耗时 ${((Date.now() - startTime) / 1000).toFixed(2)}s.`
            spinner.fail()
            console.error(e)
        }
    }

    async findTypes() {
        return await Type.find()
    }

    async count() {
        return await Novel.count({})
    }

    async saveNovels(type = {}, spinner) {
        const $ = await this.get(type.lastCrawlPage)
        const $els = $('section .list-lastupdate li').map((i, el) => el).get()

        for (let el of $els) {
            const $el = $(el)
            const link = $el.find('.name a').eq(0).attr('href')

            if (!link || await Novel.find({ link }).count() > 0) {
                continue
            }

            const schema = await this.getNovel(link, { type: $el.find('.class').html() })
            await new Novel(schema).save()
            spinner.text = spinner.text.replace(/\d+/, `${++this.novels}`)
        }

        const $next = $('.pages a.next')
        if ($next.length > 0) {
            const link = $next.attr('href')
            await Type.findByIdAndUpdate(type._id, { lastCrawlPage: link }).exec()
            await this.saveNovels(Object.assign(type, { lastCrawlPage: link }), spinner)
        }
    }
}

module.exports = new Service()