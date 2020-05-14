const domDisplayer = (() => {
  const displayTemp = (data) => {
    const row = document.querySelector('#weather-container');
    row.innerHTML = `<div class="col center-align" id="weather-content">
    <h1>${data.name}</h1>
    <div class="temp-container">
        <h4>Temprature</h4>
        <i class="fas fa-cloud"></i>
        <div class="oc-temp">
            <p>${data.main.temp}</p>
            <span>o</span>
            <p>C</p>
        </div>
    </div>
</div>`;
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
  const clearInput = () => {
    const input = document.querySelector('.validate');
    input.value = '';
  };
  return {
    showError,
    clearInput,
    displayTemp
  };
})();

export default domDisplayer;