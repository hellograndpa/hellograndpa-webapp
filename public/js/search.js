function initRange(){
    let range = document.getElementById('range');
    if(range){
        const urlParams = new URLSearchParams(window.location.search);
        let myMin = urlParams.get('priceMin');
        let myMax = urlParams.get('priceMax');
        
        if (!myMin){
            myMin=0;
        }
        if (!myMax){
            myMax=1500;
        }
        noUiSlider.create(range, {
            start: [myMin, myMax], // Handle start position
            step: 10, // Slider moves in increments of '10'
            margin: 20, // Handles must be more than '20' apart
            connect: true, // Display a colored bar between the handles
            direction: 'ltr', // Put '0' at the bottom of the slider
            orientation: 'horizontal', // Orient the slider vertically
            behaviour: 'tap-drag', // Move handle on tap, bar is draggable
            range: { // Slider can select '0' to '100'
                'min': 0,
                'max': 1500
            }, 
        });
        

        let spanMax = document.getElementById('value-span-max')
        let spanMin = document.getElementById('value-span-min');
        let inputMax = document.getElementById('priceMax');
        let inputMin = document.getElementById('priceMin');

        // When the slider value changes, update the input and span
        range.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                spanMax.innerHTML = values[handle];
                inputMax.value = values[handle];
            } else {
                spanMin.innerHTML = values[handle];
                inputMin.value = values[handle];
            }
        });


    }
}
window.onload = initRange;