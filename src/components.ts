import {Course, DailyMenu, WeeklyMenu} from './interfaces/Menu';
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

const dailyMenuTable = (courses: Course[]): string => {
  let menuHtml = `
  <table class="menu-table">
    <thead>
      <tr>
        <th>Ruoka</th>
        <th>Ruokavalio</th>
        <th>Hinta</th>
      </tr>
    </thead>
    <tbody>
  `;
  courses.forEach((course) => {
    const {name, diets, price} = course;
    menuHtml += `
      <tr>
        <td>${name}</td>
        <td>${diets ?? ' - '}</td>
        <td>${price ?? ' - '}</td>
      </tr>
    `;
  });
  menuHtml += '</tbody></table>';
  return menuHtml;
};

const weeklyMenuSection = (menu: WeeklyMenu): string => {
  let menuHtml = '';
  menu.days.forEach((dailyCourse): void => {
    let dayHtml = `<h4>${dailyCourse.date}</h4>`;
    dayHtml += dailyMenuTable(dailyCourse.courses);
    menuHtml += dayHtml;
  });
  return menuHtml;
};

const restaurantModal = (restaurant: Restaurant, menu: DailyMenu): string => {
  const {name, address, city, postalCode, phone, company} = restaurant;
  let html = `
    <button type="button" class="hide-dialog" aria-label="Piilota modaali">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <h3>${name}</h3>
    <p>${company}</p>
    <p>${address} ${postalCode} ${city}</p>
    <p>${phone}</p>
    <form id="filter-form">
      <fieldset>
        <legend>Ruokalista</legend>
        <input
          type="radio"
          id="daily"
          name="menu-type"
          value="daily-menu"
          checked
        />
        <label for="daily">Päivän</label>
        <br />
        <input type="radio" id="weekly" name="menu-type" value="weekly-menu" />
        <label for="weekly">Viikon</label>
        <br />
      </fieldset>
    </form>
    `;
  const menuTable = dailyMenuTable(menu.courses);
  html += `<section id="restaurant-menu">${menuTable}</section>`;
  return html;
};

const errorModal = (message: string): string => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};

export {
  dailyMenuTable,
  weeklyMenuSection,
  restaurantRow,
  restaurantModal,
  errorModal,
};
