interface Novel {
  name: string
}

export default function test(novel: Novel) {
  console.log('hello ' + novel.name + ' !')
}