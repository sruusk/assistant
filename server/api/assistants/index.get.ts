export default defineEventHandler(async (event) => {
  // TODO: Return the list of assistants for the current user
  const user = event.context.logtoUser;
  if(!user) {
    setResponseStatus(event, 401);
    return { error: 'Unauthorized' };
  }

  return [
    'asst_EasDLGndoWSCqptrm0WgTBxv',
    'asst_EGNCluaDVtYDIIBsQFOPUnJK'
  ];

  const data = await useStorage('user').getItem(`${user.sub}:assistants`);
  return data || [];
});
