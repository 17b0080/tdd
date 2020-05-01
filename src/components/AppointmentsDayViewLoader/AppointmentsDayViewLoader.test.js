import 'whatwg-fetch';
import React from 'react';
import { createContainer } from '../../helpers/domManipulators';
import { fetchResponseOk } from '../../helpers/spy';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import * as AppointmentsDayViewExports from '../AppointmentsDayView/AppointmentsDayView';

describe('AppointmentsDayViewLoader', () => {
  let renderAndWait;
  const today = new Date();
  const appointments = [
    { startsAt: today.setHours(9, 0, 0, 0) },
    { startsAt: today.setHours(10, 0, 0, 0) },
  ];
  beforeEach(() => {
    ({ renderAndWait } = createContainer());
    jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk(appointments));
    jest.spyOn(AppointmentsDayViewExports, 'AppointmentsDayView').mockReturnValue(null);
  });
  afterEach(() => {
    window.fetch.mockRestore();
    AppointmentsDayViewExports.AppointmentsDayView.mockRestore();
  });

  it('fetches appointments happening today when component is mounted', async () => {
    const from = today.setHours(0, 0, 0, 0);
    const to = today.setHours(23, 59, 59, 999);
    
    await renderAndWait(< AppointmentsDayViewLoader today={today} />);

    expect(window.fetch).toHaveBeenCalledWith(
      `/appointments/${from}-${to}`,
      expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
  it('initially passed no data into AppointmentsDayView', async () => {
    await renderAndWait(<AppointmentsDayViewLoader />);
    expect(AppointmentsDayViewExports.AppointmentsDayView).toHaveBeenCalledWith({ appointments: [] }, expect.anything());
  });

  it('re-requests appointments when today prop changes', async () => {
    const tomorrow = new Date(today);
    tomorrow.setHours(24);
    const from = tomorrow.setHours(0, 0, 0, 0);
    const to = tomorrow.setHours(23, 59, 59, 999);

    await renderAndWait(< AppointmentsDayViewLoader today={today} />);
    await renderAndWait(< AppointmentsDayViewLoader today={tomorrow} />);

    expect(window.fetch).toHaveBeenLastCalledWith(
      `/appointments/${from}-${to}`,
      expect.anything()
    );
  })
});