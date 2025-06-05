/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable no-console */

const helpers = function helpers() {
  const createElement = function createElement(tag, className) {
    const $element = $(`<${tag}>`).addClass(className);
    return $element[0]; // Return DOM element for compatibility
  };

  const createElementWithInnerText = function createElementWithInnerText(tag, className, text) {
    const $element = $(`<${tag}>`).addClass(className).html(text);
    return $element[0]; // Return DOM element for compatibility
  };

  const addInnerText = function addInnerText(className, text) {
    const $element = $(`#${className}`);
    $element.html(text);
    return $element.html();
  };

  async function getFahrenheit(city) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=903507f17d707fecd352d38301efba77&units=imperial`;
      const cityFahr = await $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
      });
      return cityFahr;
    } catch (error) {
      console.error('Error:', error);
      alert('Could not find the location');
    }
  }

  return {
    addInnerText, createElement, createElementWithInnerText, getFahrenheit,
  };
};

export { helpers as default };
