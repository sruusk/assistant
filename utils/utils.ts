export const acceptedFileTypes = ['text/x-c', 'text/x-c++', 'text/x-csharp', 'text/css', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/x-golang', 'text/html', 'text/x-java', 'text/javascript', 'application/json', 'text/markdown', 'application/pdf', 'text/x-php', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/x-python', 'text/x-script.python', 'text/x-ruby', 'application/x-sh', 'text/x-tex', 'application/typescript', 'text/plain'];

export const isFileTypeAccepted = (fileType: string) => acceptedFileTypes.includes(fileType.toLowerCase());