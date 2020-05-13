const getData = (() => {
  const sendRequest = async (city) => {
    try {
      const rawData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cbf4a4769da6bbf794164c449e463b35`, { mode: 'cors' });
      const data = await rawData.json();
      return data;
    } catch (err) {
        alert(err);
    }
  };
  return { sendRequest };
})();

export default getData;