import { District } from './types';

export const districts: District[] = [
  { id: 'salem', name: 'Salem', state: 'Tamil Nadu' },
  { id: 'namakkal', name: 'Namakkal', state: 'Tamil Nadu' },
  { id: 'erode', name: 'Erode', state: 'Tamil Nadu' },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'dharmapuri', name: 'Dharmapuri', state: 'Tamil Nadu' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu' },
  { id: 'trichy', name: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { id: 'karur', name: 'Karur', state: 'Tamil Nadu' },
  { id: 'krishnagiri', name: 'Krishnagiri', state: 'Tamil Nadu' },
];

export const salemAreas = [
  'Fairlands', 'Hasthampatti', 'Suramangalam', 'Ammapet', 'Shevapet',
  'Alagapuram', 'Kondalampatti', 'Junction', 'Five Roads', 'Yercaud Foothills',
];

export const districtAreas: Record<string, string[]> = {
  salem: salemAreas,
  namakkal: ['Rasipuram', 'Tiruchengode', 'Paramathi Velur', 'Sendamangalam', 'Mohanur'],
  erode: ['Perundurai', 'Bhavani', 'Gobichettipalayam', 'Sathyamangalam', 'Modakkurichi'],
  coimbatore: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Saravanampatti', 'Singanallur'],
  dharmapuri: ['Palacode', 'Harur', 'Pennagaram', 'Pappireddipatti', 'Karimangalam'],
  chennai: ['T Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Mylapore', 'Tambaram', 'Porur'],
  madurai: ['KK Nagar', 'Anna Nagar', 'Simmakkal', 'Goripalayam', 'Tallakulam', 'Thiruparankundram'],
  trichy: ['Thillai Nagar', 'Cantonment', 'Srirangam', 'K K Nagar', 'TVS Tollgate'],
  karur: ['Kulithalai', 'Aravakurichi', 'Vengamedu', 'Thanthoni', 'Pasupathipalayam'],
  krishnagiri: ['Hosur', 'Pochampalli', 'Uthangarai', 'Denkanikottai', 'Bargur'],
};

export const distanceOptions = [5, 10, 25, 50, 100];
