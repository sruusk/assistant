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
        resetConversation: 'Clear conversation',
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
