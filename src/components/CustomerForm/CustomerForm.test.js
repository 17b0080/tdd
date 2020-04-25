import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { createContainer } from '../../helpers/domManipulators';
import { CustomerForm } from './CustomerForm';

const expectToBeInputFieldOfTypeText = formElement => {
  expect(formElement).not.toBeNull();
  expect(formElement.tagName).toEqual('INPUT');
  expect(formElement.type).toEqual('text');
};


// mimic the fetch res
const fetchResponseOk = body => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body)
  });
};

const fetchResponseError = () => {
  return Promise.resolve({ ok: false });
};

describe('CustomerForm', () => {
  const originalFetch = window.fetch;
  let render, container, fetchSpy;
  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk());
    window.fetch = fetchSpy;
  });
  afterEach(() => {
    window.fetch = originalFetch;
  });
  const fetchRequestBody = () => JSON.parse(fetchSpy.mock.calls[0][1].body);
  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = name => form('customer').elements[name];
  const labelFor = formElement => {
    return container.querySelector(`label[for="${formElement}"]`);
  };
  const itRendersAsATextBox = fieldName => {
    return it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });
  };
  const itIncludesTheExistingValue = fieldName => {
    return it('includes the existing value', () => {
      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      expect(field(fieldName).value).toEqual('value');
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
      expect(field(fieldName).id).toEqual(fieldName);
    });
  };
  const itSubmitsExistingValue = fieldName => {
    return it('submits existing value', async () => {
      // arrange-act-assert
      // without submitArg test will mix into arrange-(act+assert)
      // const submitSpy = singleArgumentSpy();
      expect.hasAssertions();

      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      await ReactTestUtils.Simulate.submit(form('customer'));

      expect(fetchRequestBody()).toMatchObject({ [fieldName]: 'value' });

      // const fetchOpts = fetchSpy.receivedArgument(1);
      // expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual('value');
      // expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), )

      // expect(fetchSpy).toHaveBeenCalled();
      // expect(fetchSpy.receivedArgument(0)[fieldName]).toBe('value');
    });
  };
  const itSubmitsNewValue = fieldName => {
    return it('submits new value', async () => {
      expect.hasAssertions();

      render(<CustomerForm {...{ [fieldName]: 'existingValue' }} />);
      await ReactTestUtils.Simulate.change(field(fieldName), {
          target: { value: 'newValue', name: fieldName }
        })
      await ReactTestUtils.Simulate.submit(form('customer'));

      expect(fetchRequestBody()).toMatchObject({ [fieldName]: 'newValue' });
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
    const submitButton = container.querySelector('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  it('calls fetch with the right properties when submitting data', async () => {
    render(<CustomerForm />);
    ReactTestUtils.Simulate.submit(form('customer'));

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledWith(
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
    fetchSpy.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await act(async () => ReactTestUtils.Simulate.submit(form('customer')));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await act(async () => ReactTestUtils.Simulate.submit(form('customer')));

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();

    render(<CustomerForm />);
    await act(async () => ReactTestUtils.Simulate.submit(form('customer'), {
      preventDefault: preventDefaultSpy
    }));

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    expect.hasAssertions();
    fetchSpy.mockReturnValue(fetchResponseError());

    render(<CustomerForm />);
    await act(async () => ReactTestUtils.Simulate.submit(form('customer')));

    const errorNode = container.querySelector('.error');
    expect(errorNode).not.toBeNull();
    expect(errorNode.textContent).toMatch('error occured');
  });
});