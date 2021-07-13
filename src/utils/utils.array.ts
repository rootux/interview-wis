const sampleRandom = (items: any[]) => items[Math.floor(Math.random()*items.length)];
const getFirstWords = (body:string, count:number): string =>{
  return body.split(' ').slice(0, count).join(' ')
}
export {
  sampleRandom,
  getFirstWords
}
