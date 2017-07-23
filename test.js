let list = [{
    a: 1,
    b: 2
}, {
    a: 3,
    b: 4
}]

for (let dir of list) {
    dir.a = Math.random()
}

console.log(list)