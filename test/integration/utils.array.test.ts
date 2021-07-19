import {getFirstWords} from "../../src/utils/utils.array"

describe("test the string array", () => {
  it("should test first words", async () => {
    let firstWords = getFirstWords("some body with content of words", 3)
    expect(firstWords).toEqual("some body with")
  })
  it("should test first words with more then available", async () => {
    let firstWords = getFirstWords("some body with content of words", 10)
    expect(firstWords).toEqual("some body with content of words")
  })
})
