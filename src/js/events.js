/* eslint-disable no-alert */
/* eslint-disable no-console */
import dom from './dom';

const events = function events() {
  function showFlow(data) {
    dom().clearForms();
    dom().fillCard(data);
    dom().imageSwitch(data, 'image');
    dom().show('search');

    $('#farCel').off('click').on('click', function() {
      dom().converter(data);
    });
  }

  function forecastFlow(data) {
    dom().clearForms();
    dom().createCard(data);
    dom().show('forecast');
  }

  async function getSearch(city) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=903507f17d707fecd352d38301efba77&units=metric`;
      const cityData = await $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
      });
      showFlow(cityData);
    } catch (error) {
      console.error('Error:', error);
      alert('Could not find the location');
    }
  }

  function getLocation(searchBar) {
    const city = $(`#${searchBar}`).val().toLowerCase();
    getSearch(city);
  }

  async function getForecast() {
    try {
      const value = $('#search').val().toLowerCase();
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${value}&units=metric&appid=903507f17d707fecd352d38301efba77`;
      const cityData = await $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
      });
      forecastFlow(cityData);
    } catch (error) {
      console.error('Error:', error);
      alert('Could not find the location');
    }
  }

  return {
    getSearch, showFlow, getForecast, getLocation,
  };
};

export { events as default };
