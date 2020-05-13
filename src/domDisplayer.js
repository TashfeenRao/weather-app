const domDisplayer = (() => {
    const displayTemp = (data) => {
        const weatherContent = document.querySelector('#weather-content');
        weatherContent.querySelector('h1').textContent = data.name;
     const container = document.querySelector('.oc-temp');
     container.querySelector('p').textContent = data.main.temp;
    }
  const showError = (err) => {
    const cont = document.querySelector('#weather-content');
    cont.style.display = 'none';
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
  }
  return { showError, clearInput, displayTemp};
})();

export default domDisplayer;