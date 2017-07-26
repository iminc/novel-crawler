interface Type {
    name: string,
    link?: string
}

function test(type: Type) {
    console.log(type.name)
}

test({
    name: '1'
})