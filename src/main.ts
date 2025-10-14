import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {errorModal, restaurantModal, restaurantRow} from './components';
import {fetchData} from './functions';
import {Restaurant} from './interfaces/Restaurant';
import {apiUrl, positionOptions} from './variables';

const signUpDialog = document.querySelector('#sign-up-dialog');
const showSignUpDialogButton = document.querySelector('#show-sign-up-dialog');
const hideSignUpDialogButton = document.querySelector(
  '#sign-up-dialog .hide-dialog'
);

const logInDialog = document.querySelector('#log-in-dialog');
const showLogInDialogButton = document.querySelector('#show-log-in-dialog');
const hideLogInDialogButton = document.querySelector(
  '#log-in-dialog .hide-dialog'
);

const restaurantDialog = document.querySelector('#restaurant-dialog');

const toggleButton = document.querySelector('.toggle-button');
const mainMenu = document.querySelector('.main-menu');

const darkLightModeToggle = document.querySelector('#dark-light-mode-toggle');

const restaurantTable = document.querySelector('#restaurant-table');

if (!(signUpDialog instanceof HTMLDialogElement)) {
  throw new Error('Sign up dialog not found');
}
if (!(showSignUpDialogButton instanceof HTMLAnchorElement)) {
  throw new Error('Show sign up button not found');
}
if (!(hideSignUpDialogButton instanceof HTMLButtonElement)) {
  throw new Error('Hide sign up button not found');
}

if (!(logInDialog instanceof HTMLDialogElement)) {
  throw new Error('Log in dialog not found');
}
if (!(showLogInDialogButton instanceof HTMLAnchorElement)) {
  throw new Error('Show log in button not found');
}
if (!(hideLogInDialogButton instanceof HTMLButtonElement)) {
  throw new Error('Hide log in button not found');
}

if (!(restaurantDialog instanceof HTMLDialogElement)) {
  throw new Error('Restaurant dialog not found');
}

if (!(toggleButton instanceof HTMLSpanElement)) {
  throw new Error('Menu toggle button not found');
}
if (!(mainMenu instanceof HTMLUListElement)) {
  throw new Error('Main menu not found');
}

if (!(darkLightModeToggle instanceof HTMLAnchorElement)) {
  throw new Error('Dark light mode toggle not found');
}

if (!(restaurantTable instanceof HTMLTableElement)) {
  throw new Error('Restaurant table not found');
}

showSignUpDialogButton.addEventListener('click', (event: Event) => {
  event.preventDefault();
  signUpDialog.showModal();
});

hideSignUpDialogButton.addEventListener('click', () => {
  signUpDialog.close();
});

showLogInDialogButton.addEventListener('click', (event: Event) => {
  event.preventDefault();
  logInDialog.showModal();
});

hideLogInDialogButton.addEventListener('click', () => {
  logInDialog.close();
});

restaurantDialog.addEventListener('click', (event: Event) => {
  if (event.target instanceof Element) {
    const closestButton = event.target.closest('#restaurant-dialog button');
    if (closestButton && closestButton.matches('.hide-dialog')) {
      restaurantDialog.close();
    }
  }
});

restaurantDialog.addEventListener('close', (): void => {
  const allHighs = document.querySelectorAll('.highlight');
  allHighs.forEach((high) => {
    high.classList.remove('highlight');
  });
});

toggleButton.addEventListener('click', function () {
  mainMenu.classList.toggle('active');
  if (mainMenu.classList.contains('active')) {
    toggleButton.innerHTML = '&#215;';
  } else {
    toggleButton.innerHTML = '&#9776;';
  }
});

darkLightModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

restaurantTable.addEventListener('click', (event: Event) => {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }
  const clickedFavoriteIcon = event.target.closest(
    '#restaurant-table .favorite-icon'
  );
  if (!(clickedFavoriteIcon instanceof HTMLElement)) {
    return;
  }
  const clickedRestaurantRow = clickedFavoriteIcon.closest('tr');
  if (!clickedRestaurantRow) {
    return;
  }

  const clickedRestaurantId = clickedRestaurantRow.dataset.restaurantId;
  document
    .querySelectorAll(`.favorite-icon.fa-solid`)
    .forEach((icon: Element) => {
      const restaurantRow = icon.closest('tr');
      if (!restaurantRow) {
        return;
      }
      if (restaurantRow.dataset.restaurantId === clickedRestaurantId) {
        return;
      }
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
    });
  clickedFavoriteIcon.classList.toggle('fa-regular');
  clickedFavoriteIcon.classList.toggle('fa-solid');
});

const calculateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const createTable = (restaurants: Restaurant[]): void => {
  const tableBody = document.querySelector('#restaurant-table tbody');
  if (tableBody === null) {
    throw new Error('tableBody element was not found');
  }
  tableBody.innerHTML = '';
  restaurants.forEach((restaurant) => {
    const tr = restaurantRow(restaurant);
    tableBody.appendChild(tr);
    tr.addEventListener('click', async (event: Event) => {
      if (!event.target) {
        return;
      }
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      const clickedCell = event.target.closest('td');
      if (clickedCell && clickedCell.matches('.favorite-cell')) {
        return;
      }
      try {
        tr.classList.add('highlight');
        restaurantDialog.innerHTML = '';

        const menu = await fetchData(
          apiUrl + `/restaurants/daily/${restaurant._id}/fi`
        );

        const menuHtml = restaurantModal(restaurant, menu);
        restaurantDialog.insertAdjacentHTML('beforeend', menuHtml);

        restaurantDialog.showModal();
      } catch (error) {
        restaurantDialog.innerHTML = errorModal((error as Error).message);
        restaurantDialog.showModal();
      }
    });
  });
};

const error = (err: GeolocationPositionError): void => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos: GeolocationPosition): Promise<void> => {
  try {
    const crd = pos.coords;
    const restaurants: Restaurant[] = await fetchData(apiUrl + '/restaurants');
    restaurants.sort((a, b): number => {
      const x1 = crd.latitude;
      const y1 = crd.longitude;
      const x2a = a.location.coordinates[1];
      const y2a = a.location.coordinates[0];
      const distanceA = calculateDistance(x1, y1, x2a, y2a);
      const x2b = b.location.coordinates[1];
      const y2b = b.location.coordinates[0];
      const distanceB = calculateDistance(x1, y1, x2b, y2b);
      return distanceA - distanceB;
    });
    createTable(restaurants);

    const helsinkiCoordinates: [number, number] = [24.9375, 60.170833];
    const map = new mapboxgl.Map({
      container: 'restaurant-map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: helsinkiCoordinates, // starting position [lng, lat]
      zoom: 9, // starting zoom
      accessToken:
        'pk.eyJ1IjoiaWxra2FtdGsiLCJhIjoiY20xZzNvMmJ5MXI4YzJrcXpjMWkzYnZlYSJ9.niDiGDLgFfvA2DMqxbB1QQ',
    });

    for (const restaurant of restaurants) {
      const coordinates = restaurant.location.coordinates;
      const popupContent = `
        <h3>
          ${restaurant.name}
        </h3>
        <p>
          ${restaurant.address}
        </p>
        <p>
          ${restaurant.postalCode}
        </p>
        <p>
          ${restaurant.city}
        </p>
      `;
      const popup = new mapboxgl.Popup({offset: 25}).setHTML(popupContent);
      new mapboxgl.Marker({color: 'var(--purple)'})
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);
    }

    const filterForm = document.querySelectorAll(
      "#filter-form input[name='company']"
    );
    if (filterForm === null) {
      throw new Error('Filter form was not found');
    }
    for (const companyButton of filterForm) {
      companyButton.addEventListener('click', (event: Event): void => {
        if (!(event.target && event.target instanceof HTMLInputElement)) {
          return;
        }
        let filteredRestaurants: Restaurant[] = [];
        switch (event.target.value) {
          case 'sodexo':
            filteredRestaurants = restaurants.filter(
              (restaurant) => restaurant.company === 'Sodexo'
            );
            break;
          case 'compass-group':
            filteredRestaurants = restaurants.filter(
              (restaurant) => restaurant.company === 'Compass Group'
            );
            break;
          default:
            filteredRestaurants = restaurants;
            break;
        }
        createTable(filteredRestaurants);
      });
    }
  } catch (error) {
    restaurantDialog.innerHTML = errorModal((error as Error).message);
    restaurantDialog.showModal();
  }
};

navigator.geolocation.getCurrentPosition(success, error, positionOptions);
