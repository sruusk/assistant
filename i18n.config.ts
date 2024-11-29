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
        defaultName: 'Assistant',
        defaultInstructions: 'You are a helpful assistant that can answer questions and help with tasks.',
        missingFields: 'Missing fields, name and instructions are required',
        message: 'Message',
        messagePlaceholder: 'Type your message',
        files: 'Uploaded files',
        noFiles : 'No files uploaded',
        noAssistants: 'No assistants found',
        noAssistantsDescription: 'Create a new assistant to get started',
        modelConfig: 'Model configuration',
        noMessages: 'No messages yet 🤔',
        temperature: 'Temperature',
        topP: 'Top P',
        temperatureTip: 'The higher the temperature, the more creative the response. Lower temperatures are more predictable.',
        topPTip: 'The probability of sampling the next token. Lower values result in more predictable text.',
        resetConversation: 'Clear conversation',
        markdown: 'Markdown parser',
        latex: 'LaTeX parser',
        tokenLimitErrorTitle: 'Token Limit Exceeded',
        tokenLimitErrorDescription: 'The request is too large for the {model} model.\nReduce the number of tokens in the message or try a different model.',
        fileSizeErrorTitle: 'File Size Exceeded',
        fileSizeErrorDescription: 'One or more files exceed the maximum file size of {size}.',
        step: {
          creating: 'Creating assistant...',
          updating: 'Updating assistant...',
          uploading: 'Uploading files...',
          finishing: 'Finishing...',
        }
      },
      logout: 'Logout',
      dialog: {
        confirm: 'Confirm',
        cancel: 'Cancel',
        delete: 'Delete',
        confirmDelete: 'Confirm delete',
        deleteItem: 'Are you sure you want to delete {item}?',
        confirmLogout: 'Are you sure you want to logout?',
        logout: 'Logout',
      }
    }
  }
}))
