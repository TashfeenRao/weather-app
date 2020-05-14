const getData = (() => {
  const inCentigrade = async (city) => {
    try {
      const rawData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cbf4a4769da6bbf794164c449e463b35`, { mode: 'cors' });
      const data = await rawData.json();
      return data;
    } catch (err) {
      return err;
    }
  };
  const infahrenheit = async (city) => {
    try {
      const rawData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cbf4a4769da6bbf794164c449e463b35`, { mode: 'cors' });
      const data = await rawData.json();
      const fahrenheit = (data.main.temp * (9 / 5)) + 32;
      return fahrenheit;
    } catch (error) {
      return error;
    }
  };
  return { inCentigrade, infahrenheit };
})();

export default getData;