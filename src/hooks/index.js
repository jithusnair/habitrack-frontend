import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
// import {jwtSecret} from '$lib/envVariables';

export async function handle({ request, resolve }) {
	const cookies = cookie.parse(request.headers.cookie || '');
	const token = cookies.token;
  let decoded = null;
  try {
    decoded = jwt.decode(token);
  } catch (error) {
    console.error('JWT token invalid');
  }

	request.locals.user = decoded;
	return resolve(request);
}

export function getSession({ locals }) {
	return {
		user: locals.user && {
      uid: locals.user.uid,
      email: locals.user.email,
      fullName: locals.user.full_name
    } 
	};
}