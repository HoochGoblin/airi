const noWordSeparator = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\p{Script=Myanmar}]/u
const punctuation = /^[,.!?;:，。！？；：、]/u

/**
 * Joins recognizer endpoint segments without imposing English spacing on every script.
 *
 * @example
 * joinTranscriptSegments(['Hello', 'world'])
 * // => 'Hello world'
 *
 * @example
 * joinTranscriptSegments(['你好', '世界'])
 * // => '你好世界'
 */
export function joinTranscriptSegments(segments: Iterable<string>): string {
  let transcript = ''

  for (const segment of segments) {
    const text = segment.trim()
    if (!text)
      continue
    if (!transcript) {
      transcript = text
      continue
    }

    const previousCharacter = transcript.at(-1) ?? ''
    const nextCharacter = text.at(0) ?? ''
    const needsSpace = !/\s/u.test(previousCharacter)
      && !punctuation.test(text)
      && !noWordSeparator.test(previousCharacter)
      && !noWordSeparator.test(nextCharacter)
    transcript += needsSpace ? ` ${text}` : text
  }

  return transcript
}

const uppercaseLetter = /\p{Lu}/u
const lowercaseLetter = /\p{Ll}/u
const sentenceStart = /(^|[.!?]\s+)(\p{Ll})/gu
const pronounI = /(^|[^\p{L}\p{N}'])i(?=$|[^\p{L}\p{N}])/gu

/**
 * Converts an all-uppercase transcript to sentence case.
 *
 * Some recognizer models, for example the English Zipformer models, emit only uppercase letters.
 * Text that has a lowercase letter, or no letters, is returned unchanged.
 *
 * @example
 * toSentenceCase('HEY BETH I THINK I\'M READY')
 * // => 'Hey beth I think I\'m ready'
 */
export function toSentenceCase(text: string): string {
  if (!uppercaseLetter.test(text) || lowercaseLetter.test(text))
    return text

  return text
    .toLowerCase()
    .replace(sentenceStart, (_match, before: string, letter: string) => `${before}${letter.toUpperCase()}`)
    .replace(pronounI, (_match, before: string) => `${before}I`)
}
