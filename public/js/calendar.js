function pad(num, size) {
  let s = `${num}`;
  while (s.length < size) s = `0${s}`;
  return s;
}

function selectDate(e) {
  document.getElementById('msgErr').innerText='';

  const selectedDates = [];
  const checks = document.querySelectorAll('.chkDate');

  let countChecked = 0;
  checks.forEach((check) => {
    if (check.checked) {
      countChecked += 1;
      selectedDates.push(check.value);
    }
  });

  if (countChecked === 3) {
    document.getElementById('msgErr').innerText='Please, uncheck a selected date please';
    e.preventDefault();
  } else {
    selectedDates.sort();

    if (selectedDates.length > 0) {
      const dateInDate = new Date(selectedDates[0].substring(0, 4), selectedDates[0].substring(4, 6)-1).toDateString();
      document.querySelector('.dateInText').value = dateInDate;
      document.querySelector('.dateIn').value = selectedDates[0];
    } else {
      document.querySelector('.dateIn').value = '';
      document.querySelector('.dateInText').value = '';
    }
    if (selectedDates.length > 1) {
      const dateOutDate = new Date(selectedDates[1].substring(0, 4), selectedDates[1].substring(4, 6)).toDateString();
      document.querySelector('.dateOutText').value = dateOutDate;
      document.querySelector('.dateOut').value = selectedDates[1];
    } else {
      document.querySelector('.dateOut').value = '';
      document.querySelector('.dateOutText').value = '';
    }
  }
}

function calendarInit() {
  document
    .querySelectorAll('.chkDate')
    .forEach((el) => el.addEventListener('click', selectDate));

  let elems = document.querySelectorAll('.carousel');
  let instances = M.Carousel.init(elems, {
    fullWidth: true,
    indicators: false,
  });
  document.querySelector('.moveNextCarousel').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    M.Carousel.getInstance(document.querySelector('.carousel')).next();
  });

  // move prev carousel
  document.querySelector('.movePrevCarousel').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    M.Carousel.getInstance(document.querySelector('.carousel')).prev();
  });
}
function printCalendar() {
  if(document
    .querySelector('.carousel')){
      const houseId = document.getElementById('houseId').value;
    axios
      .get('/booking/calendar/' + houseId)
      .then((response) => {
        document
          .querySelector('.carousel')
          .insertAdjacentHTML('beforeend', response.data);
        calendarInit();
        document.querySelector('.preloader-wrapper').remove();
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  }
}

document.addEventListener('DOMContentLoaded', () => setTimeout(printCalendar, 2000));
