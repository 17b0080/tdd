// name of the file should allways be as the root component of hierarchy
import React, { useState } from 'react';

const appointmentTimeOfDay = startsAt => {
  const [h, m] = new Date(startsAt).toTimeString().split(':');
  return `${h}:${m}`;
};

export const Appointment = ({
  customer: { firstName, lastName, phoneNumber },
  stylist,
  notes,
  service
}) => (
  <div>
    <table>
      <thead>
        <tr>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Phone number</th>
          <th>Stylist</th>
          <th>Service</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{firstName}</td>
          <td>{lastName}</td>
          <td>{phoneNumber}</td>
          <td>{stylist}</td>
          <td>{service}</td>
          <td>{notes}</td>
        </tr>
      </tbody>
    </table>
  </div>
);
export const AppointmentsDayView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0);
  return (
    <div id="appointmentsDayView">
      <ol>
        {appointments.map((appointment, i) => (
          <li key={appointment.startsAt}>
            <button type="button" onClick={() => setSelectedAppointment(i)}>
              {appointmentTimeOfDay(appointment.startsAt)}
            </button>
          </li>
        ))}
      </ol>
      {!appointments.length ? (
        <p>There are no appointments scheduled for today</p>
      ) : (
        <>
          <h2>
            Today's appointment at{' '}
            {appointmentTimeOfDay(appointments[selectedAppointment].startsAt)}
          </h2>
          <Appointment {...appointments[selectedAppointment]} />
        </>
      )}
    </div>
  );
};
