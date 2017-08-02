const ora = require('ora')

require('./mongo')(async () => {
    const service = require('./service')

<<<<<<< HEAD
    // console.log(await service.count())
    // return

=======
>>>>>>> 99ce9a8c59518c92323bbeda966f9f587d70c664
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
