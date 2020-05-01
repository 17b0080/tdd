import React, { useEffect, useState } from 'react';
import { AppointmentForm } from '../AppointmentForm/AppointmentForm'
export const AppointmentFormLoader = () => {
  const [avaliableTimeSlots, setAvaliableTimeSlots] = useState([]);
  useEffect(() => {
    const fetchAvaliableTimeSlots = async () => {
      const result = await window.fetch('/avaliableTimeSlots', {
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      });
      setAvaliableTimeSlots(await result.json())
    };

    fetchAvaliableTimeSlots();
  }, []);

  return <AppointmentForm avaliableTimeSlots={avaliableTimeSlots} />;
};