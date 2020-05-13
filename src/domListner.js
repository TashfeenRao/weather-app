import getWeather from './getWeather';
const domListner = (() => {
  const getCityName = () => {
    const input = document.querySelector('.validate');
    const btn = document.querySelector('.btn-small');
    btn.addEventListener('click', () => {
      if (!input.checkValidity()) {
        console.log('empty form');
      } else {
        getWeather.sendRequest(input.value).then((data) => {
            console.log(data.main.temp);
        });
      }
    });
  };
  return { getCityName };
})();

export default domListner;