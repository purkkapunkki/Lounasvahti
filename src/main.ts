import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {errorModal, restaurantModal, restaurantRow} from './components';
import {fetchData} from './functions';
import {Restaurant} from './interfaces/Restaurant';
import {apiUrl, positionOptions} from './variables';

const modal = document.querySelector('dialog');
if (!modal) {
  throw new Error('Modal not found');
}
modal.addEventListener('click', () => {
  modal.close();
});

const calculateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const createTable = (restaurants: Restaurant[]): void => {
  const table = document.querySelector('table');
  if (table === null) {
    throw new Error('table element was not found');
  }
  table.innerHTML = '';
  restaurants.forEach((restaurant) => {
    const tr = restaurantRow(restaurant);
    table.appendChild(tr);
    tr.addEventListener('click', async () => {
      try {
        // remove all highlights
        const allHighs = document.querySelectorAll('.highlight');
        allHighs.forEach((high) => {
          high.classList.remove('highlight');
        });
        // add highlight
        tr.classList.add('highlight');
        // add restaurant data to modal
        modal.innerHTML = '';

        // fetch menu
        const menu = await fetchData(
          apiUrl + `/restaurants/daily/${restaurant._id}/fi`
        );
        console.log(menu);

        const menuHtml = restaurantModal(restaurant, menu);
        modal.insertAdjacentHTML('beforeend', menuHtml);

        modal.showModal();
      } catch (error) {
        modal.innerHTML = errorModal((error as Error).message);
        modal.showModal();
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
    console.log(restaurants);
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
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }
};

navigator.geolocation.getCurrentPosition(success, error, positionOptions);
