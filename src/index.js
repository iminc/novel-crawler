global.Promise = require('bluebird')

const fs = require('fs')
const ora = require('ora')
const { HOST, getHtml } = require('./util')

!(async () => {
    const spinner = ora(` 收录『 UC书盟小说 』共 0 类`).start()
    const startTime = Date.now()

    !fs.existsSync('./src') && fs.mkdirSync('./src')

    try {
        const $ = await getHtml()
        
        const version = {
            host: HOST,
            title: $('title').html(),
            lastUpdateTime: Date.now(),
            types: []
        }
    
        $('nav a').slice(1, 11).each((i, el) => {
            const name = $(el).html()
            const link = $(el).attr('href')
            const folder = `./src/${name}`
            !fs.existsSync(folder) && fs.mkdirSync(folder)
    
            version.types.push({ name, link, lastUpdateTime: 0 })
            spinner.text = spinner.text.replace(/\d+/, `${version.types.length}`)
        })
    
        fs.writeFileSync('./src/index.html', $.html())
        fs.writeFileSync('./src/index.json', JSON.stringify(version, null, 4))
        
        spinner.text = `${spinner.text}, 耗时 ${((Date.now() - startTime) / 1000).toFixed(2)}s.`
        spinner.succeed()
    } catch (e) {
        spinner.text = `${spinner.text}, 耗时 ${((Date.now() - startTime) / 1000).toFixed(2)}s.`
        spinner.fail()
        console.error(e)
    }
})()