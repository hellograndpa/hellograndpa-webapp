function recalcPrices() {
  const arrCheks = Array.from(document.getElementsByClassName('services'));
  const totalAmount = parseFloat(
    document.getElementById('totalAmount').innerText,
  );
  let totalDiscount = 0;

  arrCheks.forEach((curEl) => {
    if (curEl.checked) {
      totalDiscount += parseFloat(curEl.value);
    }
  });
  totalDiscount *= 2;

  document.getElementById('discountPrice').innerText = totalDiscount;
  document.getElementById('finalPrice').innerText = totalAmount - totalDiscount;

  document.getElementById('discountHidden').value = totalDiscount;
  document.getElementById('priceEndHidden').value = totalAmount - totalDiscount;
}
function init() {
  const checks = document.getElementsByClassName('services');
  for (let i = 0; i < checks.length; i++) {
    checks[i].addEventListener('click', recalcPrices);
  }
}

window.onload = init;
