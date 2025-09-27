import {Point} from './Point';

interface Restaurant {
    location: Point,
    _id: string,
    companyId: number,
    name: string,
    address: string,
    postalCode: string,
    city: string,
    phone: string,
    company: string,
    __v: number,
  }

  export {Restaurant};
