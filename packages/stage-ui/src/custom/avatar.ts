/** A bundled avatar that replaces Hiyori as the default for new devices. */
export interface CustomAvatar {
  /** Shown in the model picker. */
  name: string
  /** Same values as `DisplayModelFormat`: a VRM file, a Tachie archive, or a Live2D zip. */
  format: 'vrm' | 'tachie-zip' | 'live2d-zip'
  /**
   * URL of the model file. For the web app, put the file in
   * `apps/stage-web/public/custom-avatar/` and use `/custom-avatar/<file>`.
   * Tachie archives must end in `.tachie.zip`.
   */
  url: string
  /** Optional picker thumbnail, e.g. `/custom-avatar/preview.png`. */
  previewImage?: string
}

/** Display Model id of the custom avatar preset. */
export const CUSTOM_AVATAR_DISPLAY_MODEL_ID = 'preset-custom-1'

/**
 * Set this to make the character the built-in default, for example:
 *
 * ```ts
 * export const customAvatar: CustomAvatar | undefined = {
 *   name: 'My Character',
 *   format: 'tachie-zip',
 *   url: '/custom-avatar/my-character.tachie.zip',
 *   previewImage: '/custom-avatar/preview.png',
 * }
 * ```
 *
 * Leave it `undefined` to keep AIRI's stock default (Hiyori).
 *
 * Unit tests (Vite mode `test`) run without it, because they assert upstream's
 * stock defaults.
 */
export const customAvatar: CustomAvatar | undefined = import.meta.env.MODE === 'test'
  ? undefined
  : {
      name: 'Beth',
      format: 'vrm',
      url: '/custom-avatar/beth.vrm',
      previewImage: '/custom-avatar/beth-preview.png',
    }
