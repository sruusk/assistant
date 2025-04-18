import * as types from '~/utils/types';

export interface Message extends types.Message {}

export interface AssistantMetadata {
  max_prompt_tokens?: number, // Min 50 000
  max_completion_tokens?: number,
  last_messages?: number,
}
