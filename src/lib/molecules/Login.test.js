import '@testing-library/jest-dom';

import { render, fireEvent } from '@testing-library/svelte';


import Login from './Login.svelte';


describe('Login component', () => {
  test('Rendering', () => {
    const {getByPlaceholderText, getByText} = render(Login);

    const emailInput = getByPlaceholderText('Enter email');
    const passwordInput = getByPlaceholderText('Enter password');

    expect(getByText('Submit')).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('Submitting without any values', async () => {
    const {rerender, getByPlaceholderText} = render(Login, {email: '', password: ''});

    expect(getByPlaceholderText('Enter email')).toHaveValue('');
    expect(getByPlaceholderText('Enter password')).toHaveValue('');
    expect(getByPlaceholderText('Enter email')).toBeInvalid('jsn@example.com');
    expect(getByPlaceholderText('Enter password')).toBeInvalid('123123123');

  });

  test('test with invalid emails and password', async () => {
    const {getByPlaceholderText} = render(Login, {email:'jsn', password: ''});

    expect(getByPlaceholderText('Enter email')).toHaveDisplayValue('jsn');
    expect(getByPlaceholderText('Enter password')).toHaveDisplayValue('');
    expect(getByPlaceholderText('Enter email')).toBeInvalid();
    expect(getByPlaceholderText('Enter password')).toBeInvalid();
  });

  test('test with valid email and password', async () => {
    const {rerender, getByPlaceholderText} = render(Login, {email:'jsn@example.com', password: '123123123'});
    
    expect(getByPlaceholderText('Enter email')).toHaveDisplayValue('jsn@example.com');
    expect(getByPlaceholderText('Enter password')).toHaveDisplayValue('123123123');
    expect(getByPlaceholderText('Enter email')).toBeValid();
    expect(getByPlaceholderText('Enter password')).toBeValid();
  });
});