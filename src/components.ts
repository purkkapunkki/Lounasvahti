import {Menu} from './interfaces/Menu';
import {Restaurant} from './interfaces/Restaurant';

const restaurantRow = (restaurant: Restaurant): HTMLTableRowElement => {
  const {name, address, company} = restaurant;
  const tr = document.createElement('tr');
  tr.dataset.restaurantId = restaurant._id;
  const favoriteCell = document.createElement('td');
  favoriteCell.classList.add('favorite-cell');
  favoriteCell.innerHTML = '<i class="fa-regular fa-star favorite-icon"></i>';
  const nameCell = document.createElement('td');
  nameCell.innerText = name;
  const addressCell = document.createElement('td');
  addressCell.innerText = address;
  const companyCell = document.createElement('td');
  companyCell.innerText = company;
  tr.appendChild(favoriteCell);
  tr.appendChild(nameCell);
  tr.appendChild(addressCell);
  tr.appendChild(companyCell);
  return tr;
};

const restaurantModal = (restaurant: Restaurant, menu: Menu): string => {
  const {name, address, city, postalCode, phone, company} = restaurant;
  let html = `
    <button type="button" class="hide-dialog"><i class="fa-solid fa-xmark"></i></button>
    <h3>${name}</h3>
    <p>${company}</p>
    <p>${address} ${postalCode} ${city}</p>
    <p>${phone}</p>
    <form id="filter-form">
          <p>Ruokalista</p>
          <input
            type="radio"
            id="daily"
            name="menu"
            value="daily-menu"
            checked
          />
          <label for="daily">Päivän</label>
          <br />
          <input type="radio" id="weekly" name="menu" value="weekly-menu" />
          <label for="weekly">Viikon</label>
          <br />
      </form>
    <table>
      <thead>
        <tr>
          <th>Ruoka</th>
          <th>Ruokavalio</th>
          <th>Hinta</th>
        </tr>
      </thead>
    `;
  menu.courses.forEach((course) => {
    const {name, diets, price} = course;
    html += `
          <tr>
            <td>${name}</td>
            <td>${diets ?? ' - '}</td>
            <td>${price ?? ' - '}</td>
          </tr>
          `;
  });
  html += '</table>';
  return html;
};

const errorModal = (message: string): string => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};

export {restaurantRow, restaurantModal, errorModal};
