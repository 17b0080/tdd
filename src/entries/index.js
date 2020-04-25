import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
// import { AppointmentsDayView } from './components/AppointmentsDayView/AppointmentsDayView';
// import { sampleAppointments } from './components/AppointmentsDayView/sampleData';
import { AppointmentForm } from './components/AppointmentForm/AppointmentForm';
// import { CustomerForm } from './components/CustomerForm/CustomerForm';
const today = new Date();
const midnight = today.setHours(0, 0, 0, 0);
const date = (d, h, m) =>
  new Date(midnight + d * 24 * 60 * 60 * 1000).setHours(h, m, 0, 0);
ReactDOM.render(
  // <AppointmentsDayView appointments={sampleAppointments} />,
  <AppointmentForm
    today={new Date()}
    selectableStylists={[
      { name: 'Jhon', services: ['Cut'] },
      { name: 'Kyle', services: ['Cut', 'Blow-dry'] }
    ]}
    avaliableTimeSlots={[
      { startsAt: date(0, 9, 0), stylists: ['Jhon', 'Kyle'] },
      { startsAt: date(0, 10, 0), stylists: ['Kyle'] },
      { startsAt: date(0, 13, 30), stylists: ['Kyle'] },
      { startsAt: date(1, 16, 0), stylists: ['Kyle'] },
      { startsAt: date(1, 16, 30), stylists: ['Kyle'] },
      { startsAt: date(1, 17, 0), stylists: ['Jhon'] },
      { startsAt: date(3, 14, 0), stylists: ['Jhon'] },
      { startsAt: date(5, 15, 0), stylists: ['Jhon'] },
      { startsAt: date(6, 10, 30), stylists: ['Jhon', 'Kyle'] },
      { startsAt: date(6, 11, 0), stylists: ['Jhon', 'Kyle'] }
    ]}
  />,
  // <CustomerForm onSubmit={console.log} />,
  document.getElementById('root')
);
