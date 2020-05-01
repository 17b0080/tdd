import React, { useState, useCallback } from 'react';

const timeIncrements = (numTimes, startTime, increment) =>
  Array(numTimes)
    .fill(startTime)
    .map((time, i) => time + i * increment);

const weeklyDateValues = startDate => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return timeIncrements(7, midnight, increment);
};

const toShortDate = timestamp => {
  const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(' ');
  return `${day} ${dayOfMonth}`;
};

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return timeIncrements(totalSlots, startTime, increment);
};

const toTimeValue = timestamp =>
  new Date(timestamp).toTimeString().substring(0, 5);

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};

const RadioButtonIfAvaliable = ({
  avaliableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlot,
  handleChange,
  stylist
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  const isChecked = checkedTimeSlot === startsAt;
  if (
    avaliableTimeSlots.some(
      avaliableTimeSlot =>
        avaliableTimeSlot.startsAt === startsAt &&
        avaliableTimeSlot.stylists.includes(stylist)
    )
  ) {
    return (
      <input
        type="radio"
        name="startsAt"
        value={startsAt}
        checked={isChecked}
        onChange={handleChange}
      />
    );
  }
  return null;
};

const TimeSlotsTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  avaliableTimeSlots,
  checkedTimeSlot,
  handleStartsAtChange,
  stylist
}) => {
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
  const dates = weeklyDateValues(today);
  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map(d => (
            <th key={d}>{toShortDate(d)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map(timeSlot => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {dates.map(date => (
              <td key={date}>
                <RadioButtonIfAvaliable
                  date={date}
                  avaliableTimeSlots={avaliableTimeSlots}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  handleChange={handleStartsAtChange}
                  stylist={stylist}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  selectableServices,
  selectedService,
  onSave,
  salonOpensAt,
  salonClosesAt,
  today,
  avaliableTimeSlots,
  checkedTimeSlot,
  selectableStylists,
  selectedStylist,
  customer
}) => {
  const [appointment, setAppointment] = useState({
    stylist: selectedStylist,
    service: selectedService,
    startsAt: checkedTimeSlot
  });
  const handleServiceChange = ({ target }) =>
    setAppointment({
      ...appointment,
      service: target.value
    });
  const handleStylistChange = ({ target }) =>
    setAppointment({
      ...appointment,
      stylist: target.value
    });
  const handleStartsAtChange = useCallback(
    ({ target: { value } }) =>
      setAppointment(appointment => ({
        ...appointment,
        startsAt: Number(value)
      })),
    []
  );

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await window.fetch('/appointment', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...appointment,
        customer: customer.id
      })
    });
    
    const customerWithId = await result.json();
    onSave(customerWithId);
  };


  return (
    <form id="appointment" onSubmit={handleSubmit}>
      <label htmlFor="service" id="service">
        Service
        <select
          name="service"
          id="service"
          onChange={handleServiceChange}
          value={appointment.service}
        >
          <option />
          {selectableServices.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label htmlFor="stylist" id="stylist">
        Stylist
        <select
          name="stylist"
          id="stylist"
          onChange={handleStylistChange}
          value={appointment.stylist}
        >
          <option />
          {selectableStylists
            .filter(({ services }) => services.includes(appointment.service))
            .map(({ name }) => (
              <option key={name}>{name}</option>
            ))}
        </select>
      </label>
      <TimeSlotsTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        avaliableTimeSlots={avaliableTimeSlots}
        checkedTimeSlot={appointment.startsAt}
        handleStartsAtChange={handleStartsAtChange}
        stylist={appointment.stylist}
      />
    </form>
  );
};
/**
 * «Testing static data does happen,
 *  just not within our unit tests.
 *  One place that can be tested is
 *  within acceptance tests»
 *
 * Отрывок из книги: Daniel Irvine. «Mastering React Test-Driven Development». Apple Books.
 */
AppointmentForm.defaultProps = {
  onSave: () => {},
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
  avaliableTimeSlots: [],
  selectableServices: [
    'Cut',
    'Blow-dry',
    'Cut & color',
    'Beard trim',
    'Cut & beard trim',
    'Extensions'
  ],
  selectableStylists: []
};
