const domDisplayer = (() => {
  let weather;
  const displayFerhanheit = (temp) => {
    const content = document.querySelector('#weather-content');
    const div = document.createElement('div');
    div.className = 'temp-container farhanheit';
    div.id = 'farhanheit';
    div.innerHTML = `
    <h4>${weather.weather[0].main}</h4>
    <img src='http://openweathermap.org/img/wn/${weather.weather[0].icon}.png' />
    <div class="oc-temp">
        <p>${temp}</p>
        <span></span>
        <p>F</p>
    </div>`;
    content.appendChild(div);
  };
  const displayTemp = (data) => {
    weather = data;
    const row = document.querySelector('#weather-container');
    row.innerHTML = `<div class="col center-align" id="weather-content">
    <h1>${data.name}</h1>
    <div class="temp-container" id="centigrade">
        <h4>${weather.weather[0].main}</h4>
        <img src='http://openweathermap.org/img/wn/${data.weather[0].icon}.png' />
        <div class="oc-temp">
            <p>${Math.floor(data.main.temp)}</p>
            <span>o</span>
            <p>C</p>
        </div>
    </div>
</div>`;
    const toggle = document.createElement('div');
    toggle.className = 'switch';
    toggle.innerHTML = ` <label>
        In Farhenheit
        <input type="checkbox" id=checkbox>
        <span class="lever"></span>
        </label>`;
    row.appendChild(toggle);
  };
  const showError = () => {
    const row = document.querySelector('#weather-container');
    row.innerHTML = `<div class="col s12 m6">
      <div class="card red darken-1">
        <div class="card-content white-text">
          <span class="card-title">City Name</span>
          <p>Sorry We can't found Weather of this city</p>
        </div>
      </div>
    </div>`;
  };
  const classRemover = () => {
    document.getElementById('farhanheit').classList.toggle('farhanheit');
    document.getElementById('centigrade').classList.toggle('farhanheit');
  }
  const clearInput = () => {
    const input = document.querySelector('.validate');
    input.value = '';
  };
  return {
    showError,
    clearInput,
    displayTemp,
    displayFerhanheit,
    classRemover,
  };
})();

export default domDisplayer;