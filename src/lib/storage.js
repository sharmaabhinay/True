import { defaultProducts } from "../data/catalog";

const keys = {
  products: "tf_products",
  visitors: "tf_visitors",
  admin: "tf_admin",
};

export function readProducts() {
  try {
    const raw = localStorage.getItem(keys.products);
    return raw ? JSON.parse(raw) : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export function writeProducts(products) {
  localStorage.setItem(keys.products, JSON.stringify(products));
}

export function readVisitors() {
  try {
    const raw = localStorage.getItem(keys.visitors);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeVisitors(visitors) {
  localStorage.setItem(keys.visitors, JSON.stringify(visitors));
}

export function pushVisitor(entry) {
  const visitors = readVisitors();
  visitors.push({ ...entry, time: new Date().toISOString() });
  writeVisitors(visitors);
}

export function clearVisitors() {
  localStorage.removeItem(keys.visitors);
}

export function readAdminSession() {
  return sessionStorage.getItem(keys.admin) === "true";
}

export function writeAdminSession(value) {
  if (value) {
    sessionStorage.setItem(keys.admin, "true");
  } else {
    sessionStorage.removeItem(keys.admin);
  }
}
