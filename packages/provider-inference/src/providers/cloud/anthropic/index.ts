import type { ModelInfo } from '../../../types'

import { createChatProvider, createModelProvider, merge } from '@xsai-ext/providers/utils'
import { z } from 'zod'

import { ProviderValidationCheck } from '../../../types'
import { createOpenAICompatibleValidators } from '../../../validators'
import { defineProvider } from '../../registry'

const anthropicConfigSchema = z.object({
  apiKey: z
    .string('API Key'),
  baseUrl: z
    .string('Base URL')
    .optional()
    .default('https://api.anthropic.com/v1/'),
})

type AnthropicConfig = z.input<typeof anthropicConfigSchema>

function createAnthropic(apiKey: string, baseURL: string = 'https://api.anthropic.com/v1/') {
  const anthropicFetch = async (input: any, init: any) => {
    init.headers ??= {}
    if (Array.isArray(init.headers))
      init.headers.push(['anthropic-dangerous-direct-browser-access', 'true'])
    else if (init.headers instanceof Headers)
      init.headers.append('anthropic-dangerous-direct-browser-access', 'true')
    else
      init.headers['anthropic-dangerous-direct-browser-access'] = 'true'

    return fetch(input, init)
  }

  return merge(
    createChatProvider({ apiKey, fetch: anthropicFetch, baseURL }),
    createModelProvider({ apiKey, fetch: anthropicFetch, baseURL }),
  )
}

export const providerAnthropic = defineProvider<AnthropicConfig, 'anthropic'>({
  id: 'anthropic',
  order: 6,
  name: 'Anthropic',
  nameLocalize: ({ t }) => t('settings.pages.providers.provider.anthropic.title'),
  description: 'anthropic.com',
  descriptionLocalize: ({ t }) => t('settings.pages.providers.provider.anthropic.description'),
  tasks: ['chat'],
  icon: 'i-lobe-icons:claude',
  iconColor: 'i-lobe-icons:claude-color',

  createProviderConfig: ({ t }) => anthropicConfigSchema.extend({
    apiKey: anthropicConfigSchema.shape.apiKey.meta({
      labelLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.api-key.label'),
      descriptionLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.api-key.description'),
      placeholderLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.api-key.placeholder'),
      type: 'password',
    }),
    baseUrl: anthropicConfigSchema.shape.baseUrl.meta({
      labelLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.base-url.label'),
      descriptionLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.base-url.description'),
      placeholderLocalized: t('settings.pages.providers.catalog.edit.config.common.fields.field.base-url.placeholder'),
    }),
  }),
  createProvider(config) {
    return createAnthropic(config.apiKey, config.baseUrl)
  },

  extraMethods: {
    listModels: async () => ([
      {
        id: 'claude-opus-5-5',
        name: 'Claude Opus 5.5',
        provider: 'anthropic',
        description: 'Anthropic most capable Opus model for complex reasoning and agents',
      },
      {
        id: 'claude-sonnet-5-5',
        name: 'Claude Sonnet 5.5',
        provider: 'anthropic',
        description: 'Anthropic balance of speed and intelligence for everyday chat',
      },
      {
        id: 'claude-haiku-5-5',
        name: 'Claude Haiku 5.5',
        provider: 'anthropic',
        description: 'Anthropic fastest and lowest-cost model',
      },
      {
        id: 'claude-fable-5-1',
        name: 'Claude Fable 5.1',
        provider: 'anthropic',
        description: 'Anthropic most capable model, priced above Opus',
      },
    ] satisfies ModelInfo[]),
  },
  validationRequiredWhen(config) {
    return !!config.apiKey?.trim()
  },
  validators: {
    ...createOpenAICompatibleValidators({
      checks: [ProviderValidationCheck.Connectivity, ProviderValidationCheck.ChatCompletions],
      additionalHeaders: {
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    }),
  },
})
