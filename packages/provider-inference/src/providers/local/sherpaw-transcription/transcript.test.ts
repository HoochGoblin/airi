import { describe, expect, it } from 'vitest'

import { joinTranscriptSegments, toSentenceCase } from './transcript'

describe('joinTranscriptSegments', () => {
  it('adds spaces between Latin-script endpoint segments', () => {
    expect(joinTranscriptSegments(['Hello', 'world.'])).toBe('Hello world.')
  })

  it('does not add spaces between scripts that do not use word separators', () => {
    expect(joinTranscriptSegments(['你好', '世界'])).toBe('你好世界')
    expect(joinTranscriptSegments(['こんにちは', '世界'])).toBe('こんにちは世界')
    expect(joinTranscriptSegments(['สวัสดี', 'โลก'])).toBe('สวัสดีโลก')
  })

  it('does not add a space before punctuation', () => {
    expect(joinTranscriptSegments(['Hello', ',', 'world', '!'])).toBe('Hello, world!')
  })
})

describe('toSentenceCase', () => {
  it('converts an all-uppercase transcript to sentence case', () => {
    expect(toSentenceCase('HEY BETH HOW ARE YOU')).toBe('Hey beth how are you')
  })

  it('keeps the pronoun I uppercase, also in contractions', () => {
    expect(toSentenceCase('I THINK I\'M READY AND I\'LL GO')).toBe('I think I\'m ready and I\'ll go')
  })

  it('does not change words that contain the letter i', () => {
    expect(toSentenceCase('IT IS RAINING IN ITALY')).toBe('It is raining in italy')
  })

  it('capitalizes the first letter of each sentence', () => {
    expect(toSentenceCase('HELLO. HOW ARE YOU? GOOD')).toBe('Hello. How are you? Good')
  })

  it('does not change text that has lowercase letters', () => {
    expect(toSentenceCase('Hello World')).toBe('Hello World')
  })

  it('does not change text without letters', () => {
    expect(toSentenceCase('你好世界')).toBe('你好世界')
    expect(toSentenceCase('123')).toBe('123')
  })
})
