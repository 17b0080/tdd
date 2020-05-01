import React from 'react';
import 'whatwg-fetch';
import { createContainer } from '../../helpers/domManipulators';
import { fetchResponseOk } from '../../helpers/spy';
import { AppointmentFormLoader } from './AppointmentFormLoader';
import * as AppointmentFormExports from '../AppointmentForm/AppointmentForm';


describe('AppointmentFormLoader', () => {
  let renderAndWait;
  const today = new Date();
  const avaliableTimeSlots = [
    { startsAt: today.setHours(9, 0, 0, 0) },
  ];
  beforeEach(() => {
    ({ renderAndWait } = createContainer());
    jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk(avaliableTimeSlots));
    jest.spyOn(AppointmentFormExports, 'AppointmentForm').mockReturnValue(null);
  });
  afterEach(() => {
    window.fetch.mockRestore();
    AppointmentFormExports.AppointmentForm.mockRestore();
  });

  it('fetches data when component is mounted', async () => {
    await renderAndWait(<AppointmentFormLoader />);
    
    expect(window.fetch).toHaveBeenCalledWith(
      '/avaliableTimeSlots',
      expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }
      })
    )
  });

  it('fetched data once', async () => {
  await renderAndWait(<AppointmentFormLoader />);
  await renderAndWait(<AppointmentFormLoader />);
  
  expect(window.fetch.mock.calls.length).toEqual(1);
  })

  it('initially passes no data to AppointmentForm', async () => {
    await renderAndWait(<AppointmentFormLoader />);
    expect(AppointmentFormExports.AppointmentForm).toHaveBeenCalledWith({ avaliableTimeSlots: [] }, expect.anything());
  });

  it('displays time slots that are fetched on mount', async () => {
    await renderAndWait(<AppointmentFormLoader />);

    expect(AppointmentFormExports.AppointmentForm).toHaveBeenLastCalledWith(
      { avaliableTimeSlots, },
      expect.anything()
    )
  })
});