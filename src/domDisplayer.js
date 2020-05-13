const domDisplayer = (() => {
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
  return { showError };
})();

export default domDisplayer;