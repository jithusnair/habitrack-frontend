import {apiURL} from '$lib/envVariables';

export async function post(req) {
	const apiResponse = await fetch(apiURL + 'users/login',{
    method: "POST",
    body: req.body,
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => res.json());

  if(apiResponse.error) {
    return {
      status: 401,
      body: {...apiResponse}
    }
  }

  /**
   * NOTE: THE COOKIE HEADER SHOULD CONTAIN SAME SITE ATTRIBUTE AND DOMAIN ATTRIBUTE.
   * IT IS NOT INCLUDED IN THE LOCALHOST SOLUTION BECAUSE IT WON'T WORK WITH API SERVER
   * RUNNING ON A DIFFERENT PORT.
   * IN PRODUCTION, THE SVELTEKIT SERVER SHOULD BE SOMETHING LIKE example.com AND 
   * API SERVER SHOULD BE example.com/api AND THE COOKIES WOULD WORK FINE THEN WITH 
   * SAME SITE AND DOMAIN ATTRIBUTES 
   */

	return {
    status: 302,
		headers: {
			'set-cookie': `token=${apiResponse.token}; HttpOnly;`, 
		},
		body: {
      user: {
        uid: apiResponse.uid,
        email: apiResponse.email,
        fullName: apiResponse.full_name,
      }
    }
	};
}