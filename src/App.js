import React from 'react';
import 'App.scss';
import { DB } from './api';
const moment = require('moment');

function App() {
  let allDaysDB = [];
  let finalDB = [];

  const formatTheDate = function(date) {
    return moment()
    .format(date)
    .split('/')
    .reverse()
    .join('-');
  }

  const getDates = function(startDate, endDate) {
    let dateArray = [];
    let currentDate = moment(startDate);
    const stopDate = moment(endDate);

    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD dddd') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }


  DB.forEach(object => {
    const startDate = formatTheDate(object.startDate);
    const endDate = formatTheDate(object.endDate);
    const datesArray = getDates(startDate, endDate);
    let daysCount = 0;
    const totalTonns = object.tonns;
    let fullWeekArray = [];
    let fiveDaysWeekArray = [];

    if(!object.weekend) {
      const filterDatesArray = datesArray
        .filter(date => !(date.includes('Sunday') || date.includes('Saturday')));
      
      fiveDaysWeekArray = filterDatesArray.map(date => {
        daysCount = filterDatesArray.length;
        object.startDate = date;
        object.endDate = date;
        object.tonns = Number((totalTonns / daysCount).toFixed(2));
        
        return Object.assign({}, object)
      })

      allDaysDB = [...allDaysDB, ...fiveDaysWeekArray]
    }

    if(object.weekend) {
      fullWeekArray = datesArray.map(date => {
        daysCount = datesArray.length;
        object.startDate = date;
        object.endDate = date;
        object.tonns = Number((totalTonns / daysCount).toFixed(2));

        return Object.assign({}, object)
      })

      allDaysDB = [...allDaysDB, ...fullWeekArray]
    }
  });

  const mapWithoutRecurringDates = new Map();

  allDaysDB.forEach(entry => {
    const currentObj = {...entry}
    const id = `${currentObj.startDate} ${currentObj.resourceId}`;
    
    if(mapWithoutRecurringDates.has(id)) {
      currentObj.tonns += mapWithoutRecurringDates.get(id).tonns;
    } 

    mapWithoutRecurringDates.set(id, currentObj);
  })

  finalDB = Array.from(mapWithoutRecurringDates.values());

  //---------solution with Object-------------------

  // const objectWithoutRecurringDates = {};

  // allDaysDB.forEach(entry => {
  //   const currentObj = {...entry}
  //   const id = `${currentObj.startDate} ${currentObj.resourceId}`;

  //   if(objectWithoutRecurringDates.hasOwnProperty(id)) {
  //     currentObj.tonns += objectWithoutRecurringDates[id].tonns;
  //   }
    
  //   objectWithoutRecurringDates[id] = currentObj;
  // })

  // finalDB = Object.values(objectWithoutRecurringDates);

  //---------solution with Object-------------------

  console.log(finalDB);

  return (
    <div className="App">
      <h1>Objects</h1>
    </div>
  );
}

export default App;

