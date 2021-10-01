import '@testing-library/jest-dom';

import { render, fireEvent } from '@testing-library/svelte';

import HabitAddEdit from './HabitAddEdit.svelte';

describe('Habit Add/Edit component', () => {
  // checks if everything is rendered.
  test('Renders correctly', () => {
    // this is checked in edit mode because edit 
    // mode has all the buttons and input elements.
    const { getByPlaceholderText, getByText } = render(HabitAddEdit, {mode: 'edit'});

    expect(getByPlaceholderText('Habit Title')).toBeInTheDocument();
    expect(getByPlaceholderText('Action')).toBeInTheDocument();
    expect(getByPlaceholderText('hh:mm:ss')).toBeInTheDocument();
    expect(getByPlaceholderText('Location')).toBeInTheDocument();
    expect(getByText('Delete')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
  });

  test('Input invalid for empty values', () => {
    const { getByPlaceholderText } = render(HabitAddEdit, {
      title: '', action: '', time: '', location: ''
    });

    expect(getByPlaceholderText('Habit Title')).toBeInvalid();
    expect(getByPlaceholderText('Action')).toBeInvalid();
    expect(getByPlaceholderText('hh:mm:ss')).toBeInvalid();
    expect(getByPlaceholderText('Location')).toBeInvalid();
  });

  test('Input valid for non empty values', () => {
    const { getByPlaceholderText } = render(HabitAddEdit, {
      mode: "edit",
      title: 'Play Guitar', action: 'will play guitar', time: '18:00:00', location: 'at home'
    });

    expect(getByPlaceholderText('Habit Title')).toBeValid();
    expect(getByPlaceholderText('Action')).toBeValid();
    expect(getByPlaceholderText('hh:mm:ss')).toBeValid();
    expect(getByPlaceholderText('Location')).toBeValid();

    expect(getByPlaceholderText('Habit Title')).toHaveDisplayValue('Play Guitar');
    expect(getByPlaceholderText('Action')).toHaveDisplayValue('will play guitar');
    expect(getByPlaceholderText('hh:mm:ss')).toHaveDisplayValue('18:00:00');
    expect(getByPlaceholderText('Location')).toHaveDisplayValue('at home');
  });
})