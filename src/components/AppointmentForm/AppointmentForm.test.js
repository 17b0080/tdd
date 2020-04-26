import React from 'react';
import { createContainer, withEvent } from '../../helpers/domManipulators';
import { AppointmentForm } from './AppointmentForm';

describe('AppointmentForm', () => {
  let render, form, field, labelFor, element, elements, submit, change;
  beforeEach(() => {
    ({ render, form, field, labelFor, element, elements, submit, change } = createContainer());
  });
  const timeSlotTable = () => element('table#time-slots');

  const itRendersAsASelectBox = fieldName => {
    return it('renders as a select box', () => {
      render(<AppointmentForm />);
      expect(field('appointment', fieldName)).not.toBeNull();
      expect(field('appointment', fieldName).tagName).toEqual('SELECT');
    });
  };
  const itInitiallyHasABlankValueChosen = fieldName => {
    return it('initially has a blank value chosen', () => {
      render(<AppointmentForm />);
      const firstNode = field('appointment', fieldName).childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });
  };
  const itListsAllOptions = (fieldName, selectableOptions) => {
    return it('lists all salon options', () => {
      const propName = `selectable${fieldName.charAt(0).toUpperCase() +
        fieldName.substring(1)}s`;
      render(<AppointmentForm {...{ [propName]: selectableOptions }} />);
      const optionNodes = Array.from(field('appointment', fieldName).childNodes);
      const renderedServices = optionNodes.map(node => node.text);
      // «The toEqual matcher, when applied to arrays,
      // will check that each array has the same number
      // of elements and that each element appears in
      // the same place.»
      // Отрывок из книги: Daniel Irvine. «Mastering React Test-Driven Development». Apple Books.
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableOptions)
      );
    });
  };
  const itRendersALabel = (fieldName, text) => {
    return it('renders a label', () => {
      render(<AppointmentForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toMatch(text);
    });
  };
  const itAssignsAnIdThatMatchesTheLabelId = fieldName => {
    return it('assigns an id that matches the label id', () => {
      render(<AppointmentForm />);
      expect(labelFor(fieldName).id).toEqual(fieldName);
    });
  };
  const itSubmitsExistingValue = (fieldName, options, selectedOption) => {
    return it('submits existing value', async () => {
      expect.hasAssertions();
      const upperPropName =
        fieldName.charAt(0).toUpperCase() + fieldName.substring(1);
      const optionsPropName = `selectable${upperPropName}s`;
      const selectedOptionPropName = `selected${upperPropName}`;
      render(
        <AppointmentForm
          {...{
            [optionsPropName]: options,
            [selectedOptionPropName]: selectedOption
          }}
          onSubmit={({ [fieldName]: option }) => {
            expect(option).toEqual(selectedOption);
          }}
        />
      );
      await submit(form('appointment'));
    });
  };
  const itSubmitsNewValue = (fieldName, selectableOptions, value) => {
    return it('submits new value', async () => {
      expect.hasAssertions();
      const upperPropName =
        fieldName.charAt(0).toUpperCase() + fieldName.substring(1);
      const optionsPropName = `selectable${upperPropName}s`;
      render(
        <AppointmentForm
          {...{
            [optionsPropName]: selectableOptions
          }}
          onSubmit={({ [fieldName]: option }) => {
            expect(option).toEqual(value);
          }}
        />
      );
      await change(field('appointment', fieldName), withEvent(fieldName, value));
      await submit(form('appointment'));
    });
  };

  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });

  describe('service field', () => {
    itRendersAsASelectBox('service');
    itInitiallyHasABlankValueChosen('service');
    itListsAllOptions('service', ['Cut', 'Blow-dry']);
    itRendersALabel('service', 'Service');
    itAssignsAnIdThatMatchesTheLabelId('service');
    itSubmitsExistingValue('service', ['Cut', 'Blow-dry'], 'Cut');
    itSubmitsNewValue('service', ['Cut', 'Blow-dry'], 'Blow-dry');
  });

  describe('stylist field', () => {
    // здесь я допустил ошибку, т.к. необходимо расширить
    // поле stylist с целью сортировки квалифицированных
    // стилистов. Т.е. необходимо передавать не просто
    // массив имён, а массив объектов, включащюх имя
    // стилиста и его профессиональные навыки.

    // эти тесты можно оставить
    itRendersAsASelectBox('stylist');
    itRendersALabel('stylist', 'Stylist');
    itAssignsAnIdThatMatchesTheLabelId('stylist');
    itInitiallyHasABlankValueChosen('stylist');

    // because of filtering based on service
    // stylist field can't list all  options
    it.skip('lists all options', () => {
      const selectableStylists = [
        { name: 'Jhon', services: ['Cut'] },
        { name: 'Kyle', services: ['Blow-dry'] }
      ];
      render(<AppointmentForm selectableStylists={selectableStylists} />);
      const optionNodes = Array.from(field('appointment', 'stylist').childNodes);
      const renderedStylists = optionNodes.map(node => node.text);
      expect(renderedStylists).toEqual(
        expect.arrayContaining(selectableStylists.map(({ name }) => name))
      );
    });

    it('submits existing value', async () => {
      expect.hasAssertions();
      const selectedStylist = 'Jhon';
      render(
        <AppointmentForm
          selectedStylist={selectedStylist}
          onSubmit={({ stylist }) => {
            expect(stylist).toEqual(selectedStylist);
          }}
        />
      );
      await submit(form('appointment'));
    });
    it('submits new value', async () => {
      expect.hasAssertions();
      const selectableStylists = [
        { name: 'Jhon', services: ['Cut'] },
        { name: 'Kyle', services: ['Blow-dry'] }
      ];
      const selectedStylist = 'Jhon';
      const stylistToSelect = 'Kyle';
      render(
        <AppointmentForm
          selectableStylists={selectableStylists}
          selectedStylist={selectedStylist}
          onSubmit={({ stylist }) => {
            expect(stylist).toEqual(stylistToSelect);
          }}
        />
      );
      await change(field('appointment', 'stylist'), withEvent(null, stylistToSelect));
      await submit(form('appointment'));
    });
  });

  const startsAtField = index =>
    elements('input[name="startsAt"]')[index];

  describe('time slot table', () => {
    it('renders a table for time slots', () => {
      render(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull();
    });
    it('renders a time slot for every half an hour between open and close times', () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11} />);
      const timesOfDay = timeSlotTable().querySelectorAll('tbody >* th');
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual('09:00');
      expect(timesOfDay[1].textContent).toEqual('09:30');
      expect(timesOfDay[3].textContent).toEqual('10:30');
    });
    it('renders an empty cell at the start of the header row', () => {
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector('thead > tr');
      expect(headerRow.firstChild.textContent).toEqual('');
    });
    it('renders a week of avaliable dates', () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        'thead >* th:not(:first-child)'
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });
    it('renders radio button for each time slot', () => {
      const today = new Date();
      const selectableStylists = [{ name: 'Jhon', services: 'Cut' }];
      const selectedStylist = 'Jhon';
      const selectedService = 'Cut';
      const avaliableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0), stylists: ['Jhon'] },
        { startsAt: today.setHours(9, 30, 0, 0), stylists: ['Jhon'] }
      ];
      render(
        <AppointmentForm
          selectableStylists={selectableStylists}
          selectedStylist={selectedStylist}
          selectedService={selectedService}
          today={today}
          avaliableTimeSlots={avaliableTimeSlots}
        />
      );
      const cells = timeSlotTable().querySelectorAll('td');
      expect(cells[0].querySelector('input[type="radio"]')).not.toBeNull();
      expect(cells[7].querySelector('input[type="radio"]')).not.toBeNull();
    });
    it('does not render radio buttons for unavaliable time slots', () => {
      render(<AppointmentForm avaliableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });
    it('sets radio buttons value to the index of corresponding appointment', () => {
      const today = new Date();
      const selectableStylists = [{ name: 'Jhon', services: 'Cut' }];
      const selectedStylist = 'Jhon';
      const selectedService = 'Cut';
      const avaliableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0), stylists: ['Jhon'] },
        { startsAt: today.setHours(9, 30, 0, 0), stylists: ['Jhon'] }
      ];
      render(
        <AppointmentForm
          selectableStylists={selectableStylists}
          selectedStylist={selectedStylist}
          selectedService={selectedService}
          today={today}
          avaliableTimeSlots={avaliableTimeSlots}
        />
      );
      expect(startsAtField(0).value).toEqual(
        avaliableTimeSlots[0].startsAt.toString()
      );
      expect(startsAtField(1).value).toEqual(
        avaliableTimeSlots[1].startsAt.toString()
      );
    });
    it('filters stylists by chosen service', () => {
      const selectedService = 'Cut';
      const selectableStylists = [
        { name: 'Jhon', services: ['Cut'] },
        { name: 'Kyle', services: ['Blow-dry'] }
      ];
      render(
        <AppointmentForm
          selectedService={selectedService}
          selectableStylists={selectableStylists}
        />
      );
      const optionNodes = Array.from(field('appointment', 'stylist').childNodes);
      const renderedStylists = optionNodes.map(node => node.text);
      expect(renderedStylists).toEqual(['', 'Jhon']);
    });

    it('does not render radio buttons for unqualified stylists filtered by choosen service', () => {
      const today = new Date();
      const selectableServices = ['Cut', 'Blow-dry'];
      const selectedService = 'Cut';
      const avaliableTimeSlots = [
        {
          startsAt: today.setHours(9, 0, 0, 0),
          stylists: ['Jhon', 'Kyle']
        },
        {
          startsAt: today.setHours(9, 30, 0, 0),
          stylists: ['Kyle']
        }
      ];
      const selectableStylists = [
        { name: 'Jhon', services: ['Cut'] },
        { name: 'Kyle', services: ['Blow-dry'] }
      ];
      const selectedStylist = 'Jhon';
      render(
        <AppointmentForm
          today={today}
          selectableServices={selectableServices}
          selectedService={selectedService}
          selectableStylists={selectableStylists}
          selectedStylist={selectedStylist}
          avaliableTimeSlots={avaliableTimeSlots}
        />
      );
      const cells = timeSlotTable().querySelectorAll('td');
      expect(cells[0].querySelector('input[type="radio"]')).not.toBeNull();
      expect(cells[7].querySelector('input[type="radio"]')).toBeNull();
    });
    describe('radio button', () => {
      it('pre-selects the existing value', () => {
        const today = new Date();
        const selectableStylists = [{ name: 'Jhon', services: 'Cut' }];
        const selectedStylist = 'Jhon';
        const selectedService = 'Cut';
        const avaliableTimeSlots = [
          { startsAt: today.setHours(9, 0, 0, 0), stylists: ['Jhon'] },
          { startsAt: today.setHours(9, 30, 0, 0), stylists: ['Jhon'] }
        ];
        const checkedTimeSlot = today.setHours(9, 0, 0, 0);
        render(
          <AppointmentForm
            selectableStylists={selectableStylists}
            selectedStylist={selectedStylist}
            selectedService={selectedService}
            today={today}
            avaliableTimeSlots={avaliableTimeSlots}
            checkedTimeSlot={checkedTimeSlot}
          />
        );
        expect(startsAtField(0).checked).toBeTruthy();
      });
      it('submits the existng value', async () => {
        expect.hasAssertions();
        const today = new Date();
        const selectableStylists = [{ name: 'Jhon', services: 'Cut' }];
        const selectedStylist = 'Jhon';
        const selectedService = 'Cut';
        const avaliableTimeSlots = [
          { startsAt: today.setHours(9, 0, 0, 0), stylists: ['Jhon'] },
          { startsAt: today.setHours(9, 30, 0, 0), stylists: ['Jhon'] }
        ];
        const checkedTimeSlot = today.setHours(9, 0, 0, 0);
        render(
          <AppointmentForm
            selectableStylists={selectableStylists}
            selectedStylist={selectedStylist}
            selectedService={selectedService}
            today={today}
            avaliableTimeSlots={avaliableTimeSlots}
            checkedTimeSlot={checkedTimeSlot}
            onSubmit={({ startsAt }) =>
              expect(startsAt).toEqual(checkedTimeSlot)
            }
          />
        );
        await submit(form('appointment'));
      });
      it('submits new value', async () => {
        expect.hasAssertions();
        const today = new Date();
        const selectableStylists = [{ name: 'Jhon', services: 'Cut' }];
        const selectedStylist = 'Jhon';
        const selectedService = 'Cut';
        const avaliableTimeSlots = [
          { startsAt: today.setHours(9, 0, 0, 0), stylists: ['Jhon'] },
          { startsAt: today.setHours(9, 30, 0, 0), stylists: ['Jhon'] }
        ];
        const checkedTimeSlot = today.setHours(9, 0, 0, 0);
        const newlySelectedTimeSlot = today.setHours(9, 30, 0, 0);
        render(
          <AppointmentForm
            selectableStylists={selectableStylists}
            selectedStylist={selectedStylist}
            selectedService={selectedService}
            today={today}
            avaliableTimeSlots={avaliableTimeSlots}
            checkedTimeSlot={checkedTimeSlot}
            onSubmit={({ startsAt }) =>
              expect(startsAt).toEqual(newlySelectedTimeSlot)
            }
          />
        );
        await change(startsAtField(1), withEvent(null, newlySelectedTimeSlot) );
        expect(startsAtField(0).checked).not.toBeTruthy();
        await submit(form('appointment'));
      });
    });
  });
});
