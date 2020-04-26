import 'whatwg-fetch';
import React from 'react';
import { createContainer } from '../../helpers/domManipulators';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from '../../helpers/spy';
import { CustomerForm } from './CustomerForm';

const expectToBeInputFieldOfTypeText = formElement => {
  expect(formElement).not.toBeNull();
  expect(formElement.tagName).toEqual('INPUT');
  expect(formElement.type).toEqual('text');
};

describe('CustomerForm', () => {
  // const originalFetch = window.fetch;
  let render, container, form, field, labelFor, element, click, change, submit;
  beforeEach(() => {
    ({ render, container, form, field, labelFor, element, click, change, submit } = createContainer());
    jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk())
  });
  afterEach(() => {
    window.fetch.mockRestore();
  });
  const itRendersAsATextBox = fieldName => {
    return it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field('customer', fieldName));
    });
  };
  const itIncludesTheExistingValue = fieldName => {
    return it('includes the existing value', () => {
      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      expect(field('customer', fieldName).value).toEqual('value');
    });
  };
  const itRendersALabel = (fieldName, labelText) => {
    return it('renders a label', () => {
      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(labelText);
    });
  };
  const itAssignsAnIdThatMatchesTheLabelId = fieldName => {
    return it('assigns an id that matches the label id', () => {
      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      expect(field('customer', fieldName).id).toEqual(fieldName);
    });
  };
  const itSubmitsExistingValue = fieldName => {
    return it('submits existing value', async () => {
      // arrange-act-assert
      // without submitArg test will mix into arrange-(act+assert)
      // const submitSpy = singleArgumentSpy();
      expect.hasAssertions();

      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      await submit(form('customer'));

      expect(requestBodyOf(window.fetch)).toMatchObject({ [fieldName]: 'value' });
    });
  };
  const itSubmitsNewValue = fieldName => {
    return it('submits new value', async () => {
      expect.hasAssertions();

      render(<CustomerForm {...{ [fieldName]: 'existingValue' }} />);
      change(
        field('customer', fieldName),
        {
          target: { value: 'newValue', name: fieldName }
        }
      );
      await submit(form('customer'));

      // expect(requestBodyOf(fetchSpy)).toMatchObject({ [fieldName]: 'newValue' });
      expect(requestBodyOf(window.fetch)).toMatchObject({ [fieldName]: 'newValue' });
    });
  };

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  describe('first name field', () => {
    itRendersAsATextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRendersALabel('firstName', 'First name');
    itAssignsAnIdThatMatchesTheLabelId('firstName');
    itSubmitsExistingValue('firstName');
    itSubmitsNewValue('firstName');
  });

  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName', 'Last name');
    itAssignsAnIdThatMatchesTheLabelId('lastName');
    itSubmitsExistingValue('lastName');
    itSubmitsNewValue('lastName');
  });

  describe('phone number field', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber', 'Phone number');
    itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
    itSubmitsExistingValue('phoneNumber');
    itSubmitsNewValue('phoneNumber');
  });

  it('has a submit button', () => {
    render(<CustomerForm />);
    expect(element('input[type="submit"]')).not.toBeNull();
  });

  it('calls fetch with the right properties when submitting data', async () => {
    render(<CustomerForm />);
    await submit(form('customer'));

    expect(window.fetch).toHaveBeenCalled();
    expect(window.fetch).toHaveBeenCalledWith(
      '/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 };
    // fetchSpy.mockReturnValue(fetchResponseOk(customer));
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await submit(form('customer'));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    // fetchSpy.mockReturnValue(fetchResponseError());
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await submit(form('customer'));

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();

    render(<CustomerForm />);
    await submit(form('customer'), { preventDefault: preventDefaultSpy });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    expect.hasAssertions();
    // fetchSpy.mockReturnValue(fetchResponseError());
    window.fetch.mockReturnValue(fetchResponseError());

    render(<CustomerForm />);
    await submit(form('customer'));

    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch('error occured');
  });
});
