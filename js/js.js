"use strict";

const apiUrl = "https://media1.edu.metropolia.fi/restaurant/api/v1";

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const json = await response.json();
  return json;
}

function showRestaurants(restaurants) {
  // Sort the restaurants by name
  restaurants.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  for (const restaurant of restaurants) {
    // TODO: show the restaurant's info on the page
  }
}

function showRestaurantFetchingError(reason) {
  const errorMessage = `Failed to fetch restaurant data: ${reason}`;
  // TODO: show the error message on the page
}

async function fetchRestaurants() {
  return await fetchData(`${apiUrl}/restaurants`);
}

function showDailyMenu(dailyMenu) {
  if (dailyMenu.courses.length > 0) {
    // TODO: show the daily menu on the page
  } else {
    // TODO: inform the user that no food is available today
  }
}

function showDailyMenuFetchingError(reason) {
  const errorMessage = `Failed to fetch daily menu data: ${reason}`;
  // TODO: show the error message on the page
}

async function fetchDailyMenu(restaurant) {
  return await fetchData(`${apiUrl}/restaurants/daily/${restaurant._id}/fi`);
}

// TODO: fetch restaurants like this:
// fetchRestaurants().then(showRestaurants, showRestaurantFetchingError);

// TODO: fetch daily menu like this:
// await fetchDailyMenu(restaurant).then(
//     showDailyMenu,
//     showDailyMenuFetchingError
// );
