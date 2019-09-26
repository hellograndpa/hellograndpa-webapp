function acceptBooking(e) {
    let bookingId = e.target.parentElement.firstChild.nextSibling.value;
    let dateIn = e.target.parentElement.childNodes[3].value;
    let dateOut = e.target.parentElement.childNodes[5].value;
    let houseId =  e.target.parentElement.childNodes[7].value;
    let parent = e.target.parentElement;

    parent.innerHTML = '<div class="preloader-wrapper active"><div class="spinner-layer spinner-red-only"><div class="circle-clipper left">'
                    + '<div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right">'
                    + '<div class="circle"></div></div></div></div>';
    axios
    .get('/user/bookings/' + bookingId +'/gest?action=accept&dateIn='+ dateIn +'dateOut='+ dateOut+'&houseId='+houseId)
    .then((response) => {

        parent.innerHTML = '<span class="green-text text-darken-4 valign-wrapper"><h2>Well done!</h2></span>';
    })
    .catch(function(error) {
      console.log(error);
    })

}
function cancelBooking(e) {
    let bookingId = e.target.parentElement.firstChild.nextSibling.value;
    let dateIn = e.target.parentElement.childNodes[3].value;
    let dateOut = e.target.parentElement.childNodes[5].value;
    let houseId =  e.target.parentElement.childNodes[7].value;
    let parent = e.target.parentElement;

    parent.innerHTML = '<div class="preloader-wrapper active"><div class="spinner-layer spinner-red-only"><div class="circle-clipper left">'
                    + '<div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right">'
                    + '<div class="circle"></div></div></div></div>';
    axios
    .get('/user/bookings/' + bookingId +'/gest?action=cancel&dateIn='+ dateIn +'dateOut='+ dateOut+'&houseId='+houseId)
    .then((response) => {

        parent.innerHTML = '<span class="red-text text-darken-4 valign-wrapper"><h2>OOOOOh!</h2></span>';
    })
    .catch(function(error) {
      console.log(error);
    })

}

document.addEventListener('DOMContentLoaded', function() {
    let acceptButtons = document.getElementsByClassName("acceptBooking");

    let cancelButtons = document.getElementsByClassName("cancelBooking")

    for(let i=0; i<acceptButtons.length; i++){
        acceptButtons[i].addEventListener("click",acceptBooking);
    }
    for(let i=0; i<cancelButtons.length; i++){
        cancelButtons[i].addEventListener("click",cancelBooking);
    }
}); 
