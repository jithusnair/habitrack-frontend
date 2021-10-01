
export async function post() {
	return {
    status: 204, 
    headers: {
      'set-cookie': 'token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    },
  };
}