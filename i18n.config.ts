export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'en',
  messages: {
    en: {
      landing: {
        title: 'Welcome to Assistant',
        description: 'Your personal assistant for everything without monthly subscriptions or ads. Powered by OpenAI.',
        login: 'Login/Signup',
      },
      dashboard: {
        selectAssistant: 'Select Assistant',
        name: 'Name',
        instructions: 'System instructions',
        model: 'Language model',
        upload: 'Upload files',
        save: 'Save',
        newAssistant: 'New Assistant',
        missingFields: 'Missing fields, name and instructions are required',
        message: 'Message',
        messagePlaceholder: 'Type your message',
        files: 'Uploaded files',
        noFiles : 'No files uploaded',
        noAssistants: 'No assistants found',
        noAssistantsDescription: 'Create a new assistant to get started',
        modelConfig: 'Model configuration',
        noMessages: 'No messages yet 🤔, start a conversation by sending a message',
        temperature: 'Temperature',
        topP: 'Top P',
        temperatureTip: 'The higher the temperature, the more creative the response. Lower temperatures are more predictable.',
        topPTip: 'The probability of sampling the next token. Lower values result in more predictable text.',
        resetConversation: 'Clear conversation',
        markdown: 'Markdown parser',
        latex: 'LaTeX parser',
        tokenLimitErrorTitle: 'Token Limit Exceeded',
        tokenLimitErrorDescription: 'The request is too large for the {model} model.\nReduce the number of tokens in the message or try a different model.',
        step: {
          creating: 'Creating assistant...',
          updating: 'Updating assistant...',
          uploading: 'Uploading files...',
          finishing: 'Finishing...',
        }
      },
      logout: 'Logout',
    }
  }
}))
