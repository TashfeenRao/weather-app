import './style.scss';
import './js/bin/materialize.min';
import './sass/materialize.scss';
import getData from './getWeather';
import domListner from './domListner';

domListner.getCityName();

/* getData.sendRequest().then((object) => {
console.log(object);
}); */