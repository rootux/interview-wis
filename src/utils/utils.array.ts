const sampleRandom = (items: any[]) => items[Math.floor(Math.random()*items.length)];
const getFirstWords = (body:string, count:number): string =>{
  return body.split(' ').slice(0, count).join(' ')
}
// Slice an array elements by percentage
const sliceWindow = (array:any[], count:number, percentage:number) => {
  const sizeOfFirstSlice = Math.round(count * percentage)
  const firstSlice = array.slice(0, sizeOfFirstSlice)
  const secondSlice = array.slice(sizeOfFirstSlice)
  return [firstSlice, secondSlice]
}

export {
  sampleRandom,
  getFirstWords,
  sliceWindow
}
