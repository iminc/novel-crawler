const ora = require('ora')

require('./mongo')(async () => {
    const service = require('./service')

    console.log(await service.count())
    return

    const types = await service.init()
    for (let type of types) {
        service.novels = 0
        const spinner = ora(` 收录『 ${type.name} 』共 0 本`).start()
        const startTime = Date.now()
        try {
            await service.saveNovels(type, spinner)

            spinner.text = `${spinner.text}, 耗时 ${((Date.now() - startTime) / 1000).toFixed(2)}s.`
            spinner.succeed()
        } catch (e) {
            spinner.text = `${spinner.text}, 耗时 ${((Date.now() - startTime) / 1000).toFixed(2)}s.`
            spinner.fail()
            console.error(e)
        }
    }
})
