function pad(num, size) {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

function selectDate(e){


  let selectedDates=[];
  let checks = document.querySelectorAll('input[type=checkbox]');
  let countChecked=0;
  checks.forEach(e => {
    if(e.checked){
      countChecked +=1
      selectedDates.push(e.value)
    }
  })
  if(countChecked===3){
    alert('No puedes seleccionar mas de 2');
    e.preventDefault();
  }else{
    selectedDates.sort();

    if(selectedDates.length>0){
      document.querySelector('.dateIn').value=selectedDates[0];
    }else{
      document.querySelector('.dateIn').value=''
    }
    if(selectedDates.length>1){
      document.querySelector('.dateOut').value=selectedDates[1];
    }else{
      document.querySelector('.dateOut').value='';
    }
    
  }
 
}

const arrMonths=['Jan','Feb','Mar','Apr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function printCalendar() {
  let calText = '';
  const actualMonthYear = 201909;
  for (i=2019; i<2025; i++) { 
    calText +='<div class="carousel-item teal white-text checkboxes" href="#one!">';
    calText +='<div class="calendar-year-wrapper">';
    calText +='<div class="year-title">'+ i +'</div>';
    calText +='<div class="row">';
    for (let m=1; m<13; m++){
      let yearMonth = i + pad(m,2);
        
        calText +='<div class="col s6 m3">';
        
        if (parseInt(yearMonth)<=actualMonthYear){
            calText +='<label class="none lbldate" for="'+yearMonth+'">'+ arrMonths[m-1] +'</label>';
        }else{
          calText +='<input type="checkbox" name="rGroup" class="chkDate" value="'+yearMonth+'" id="'+yearMonth+'"  />';
            calText +='<label class="whatever lbldate" for="'+yearMonth+'">'+ arrMonths[m-1] +'</label>';
        }
        
        calText +='</div>';         
    }
    calText +='</div></div></div>';      
  }
    document.querySelector('.carousel').insertAdjacentHTML('beforeend', calText);

    document.querySelectorAll('.chkDate').forEach(el => el.addEventListener('click', selectDate));
    

    document.querySelector('.moveNextCarousel').addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        M.Carousel.getInstance(document.querySelector('.carousel')).next();
      });
      
      // move prev carousel
      document.querySelector('.movePrevCarousel').addEventListener('click',function(e){   
        e.preventDefault();
        e.stopPropagation();
       M.Carousel.getInstance(document.querySelector('.carousel')).prev();
      });
}

let dateIn='';
let dateOut='';

