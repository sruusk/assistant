let accessToken: string | null = null;

export const updateLogtoCustomData = async (event: any, newData: any) => {
  const config = useRuntimeConfig();
  const user = event.context.user;
  const userCustomData = user.custom_data || {};
  const newCustomData = {...userCustomData, ...newData};
  const token = accessToken || (await getAccessToken()).access_token;
  const response = await $fetch(`${config.logtoEndpoint}api/users/${user.sub}/custom-data`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({customData: newCustomData})
  }).catch((e: any) => {
    console.error('Failed to update custom data:', e);
    throw e;
  });
  console.log('Updated custom data:', response);
}

/*
curl \
 -X PATCH https://[tenant_id].logto.app/api/users/{userId}/custom-data \
 -H "Authorization: Bearer $ACCESS_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"customData":{}}'
 */


const getAccessToken = async (): Promise<AccessTokenResponse> => {
  const config = useRuntimeConfig();
  const token = await $fetch(`${config.logtoEndpoint}oidc/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${config.logtoM2mAppId}:${config.logtoM2mAppSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      resource: `${config.logtoManagementEndpoint}api`,
      scope: 'all'
    }).toString()
  }) as unknown as AccessTokenResponse;
  accessToken = token.access_token;
  setTimeout(
    () => accessToken = null,
    (token.expires_in - 300) * 1000
  ); // Refresh token 5 minutes before it expires
  return token;
}

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
  scope: "all";
}
