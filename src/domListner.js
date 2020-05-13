const domListner = (() => {
  const getCityName = () => {
    const input = document.querySelector('.validate');
    const btn = document.querySelector('.btn-small');
    btn.addEventListener('click', () => {
      if (!input.checkValidity()) {
        console.log('empty form');
      } else {
        console.log(input.value);
      }
    });
  };
  return { getCityName };
})();

export default domListner;