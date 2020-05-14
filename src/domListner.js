import getWeather from './getWeather';
import domDisplayer from './domDisplayer';

const domListner = (() => {
  const getCityName = () => {
    const input = document.querySelector('.validate');
    const btn = document.querySelector('.btn-small');
    btn.addEventListener('click', () => {
      if (!input.checkValidity()) {
        console.log('empty form');
      } else {
        getWeather.inCentigrade(input.value).then((data) => {
          domDisplayer.clearInput();
          console.log(data);
          domDisplayer.displayTemp(data);
        }).catch(() => {
          domDisplayer.showError();
        });
        getWeather.infahrenheit(input.value).then((temp) => {
          domDisplayer.displayFerhanheit(temp);
        }).catch(() => {
          domDisplayer.showError();
        });
      }
    });
  };
  return { getCityName };
})();

export default domListner;