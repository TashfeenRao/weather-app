/* eslint-disable consistent-return */
import getWeather from './getWeather';
import domDisplayer from './domDisplayer';

const domListner = (() => {
  const getTempInFarhanheit = (input) => {
    getWeather.infahrenheit(input.value).then((temp) => {
      domDisplayer.displayFerhanheit(temp);
    }).catch(() => {
      domDisplayer.showError();
    });
  };
  const FarhanheitToggler = () => {
    const checkbox = document.querySelector('#checkbox');
    checkbox.addEventListener('click', () => {
      domDisplayer.classRemover();
    });
  };
  const getTempInCentigrade = (input) => {
    getWeather.inCentigrade(input.value).then((data) => {
      domDisplayer.clearInput();
      domDisplayer.displayTemp(data);
      FarhanheitToggler();
    }).catch(() => {
      domDisplayer.showError();
    });
  };
  const checkValidity = () => {
    const input = document.querySelector('.validate');
    if (!input.checkValidity()) {
      domDisplayer.emptyinput();
    } else {
      getTempInCentigrade(input);
      getTempInFarhanheit(input);
    }
  };
  const getCityName = () => {
    const btn = document.querySelector('.btn-small');
    btn.addEventListener('click', checkValidity);
  };

  return { getCityName };
})();

export default domListner;