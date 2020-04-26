// red -> green -> refactor
// to.skip(red) -> green ;)
import React from 'react';
import { Appointment, AppointmentsDayView } from './AppointmentsDayView';
import { createContainer } from '../../helpers/domManipulators';
/**
 * A good test has three distinct sections:
 * 1. Arrange: Sets up test dependencies,
 * 2. Act: Executes production code under test,
 * 3. Assert: Checks expectations are met.
 */

/**
 * A great test is not just good but is also the following:
 * 1. Short,
 * 2. Descriptive,
 * 3. Independent of other tests,
 * 4. Has no side-effects.
 */

describe('Appointment', () => {
  let container, render;
  let customer;
  let stylist;
  let notes;
  beforeEach(() => {
    ({ container, render } = createContainer());
  });
  // never use shared state (document) in unit tests
  it('renders customer first name', () => {
    // Appointment renders customer first name
    customer = { firstName: 'Ashley' };
    render(<Appointment customer={customer} />);
    expect(container.textContent).toMatch('Ashley');
    // I expect document.body.textContent to match string Ashley
    // -> I expect container.textContent to match string Ashley
  });
  // Never refactor, rework, change course while we're red
  it('renders another customer first name', () => {
    // Appointment renders another customer first name
    customer = { firstName: 'Jordan' };
    render(<Appointment customer={customer} />);
    expect(container.textContent).toMatch('Jordan');
    // I expect document.body.textContent to match string Jordan
    // -> I expect container.textContent to match string Jordan
  });
  it('renders customer last name', () => {
    customer = { lastName: 'Renowski' };
    render(<Appointment customer={customer} />);
    expect(container.textContent).toMatch('Renowski');
  });
  it('renders another customer last name', () => {
    customer = { lastName: 'Jeronimo' };
    render(<Appointment customer={customer} />);
    expect(container.textContent).toMatch('Jeronimo');
  });
  it('renders customer phone number', () => {
    customer = { phoneNumber: '79267144012' };
    render(<Appointment customer={customer} />);
    expect(container.textContent).toMatch('79267144012');
  });
  it('renders stylist name', () => {
    customer = {};
    stylist = 'Kyle';
    render(<Appointment customer={customer} stylist={stylist} />);
    expect(container.textContent).toMatch(stylist);
  });
  it('renders another stylist name', () => {
    customer = {};
    stylist = 'Leros';
    render(<Appointment customer={customer} stylist={stylist} />);
    expect(container.textContent).toMatch(stylist);
  });
  it('renders notes', () => {
    customer = {};
    notes = 'Notes...';
    render(<Appointment customer={customer} notes={notes} />);
    expect(container.textContent).toMatch(notes);
  });
  it('renders another notes', () => {
    customer = {};
    notes = 'Another notes...';
    render(<Appointment customer={customer} notes={notes} />);
    expect(container.textContent).toMatch(notes);
  });
  it('renders service', () => {
    customer = {};
    const service = 'Gucci';
    render(<Appointment customer={customer} service={service} />);
    expect(container.textContent).toMatch(service);
  });
});

describe('AppointmentsDayView', () => {
  let render, container, element, elements, click;
  const today = new Date();
  const appointments = [
    {
      startsAt: today.setHours(12, 0),
      customer: { firstName: 'Ashley' },
      stylist: ''
    },
    {
      startsAt: today.setHours(13, 0),
      customer: { firstName: 'Jordan' },
      stylist: ''
    }
  ];
  beforeEach(() => {
    ({ render, container, element, elements, click } = createContainer())
  });
  it('renders a div with the right id', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(element('div#appointmentsDayView')).not.toBeNull();
  });
  it('renders multiple appointments in ol element', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(element('ol')).not.toBeNull();
    expect(element('ol').children).toHaveLength(2);
  });
  it('renders each appointment in li element', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(elements('li')).toHaveLength(2);
    expect(elements('li')[0].textContent).toEqual('12:00');
    expect(elements('li')[1].textContent).toEqual('13:00');
  });
  it('initially shows a message saying there are no appointments today', () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container.textContent).toMatch(
      'There are no appointments scheduled for today'
    );
  });
  it('selects the first appointment by default', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.textContent).toMatch('Ashley');
  });
  it('has a button element in each li', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(elements('li')).toHaveLength(2);
    expect(elements('li > button')[0].type).toEqual('button');
  });
  it('renders another appointment when selected', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const button = elements('li > button')[1];
    click(button);
    expect(container.textContent).toMatch('Jordan');
  });
  it('renders selected appointment time', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.textContent).toMatch("Today's appointment at 12:00");
  });
});
