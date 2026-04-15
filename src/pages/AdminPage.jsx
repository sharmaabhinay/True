import { useMemo, useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import {
  DashboardPanel,
  OrdersPanel,
  ProductsPanel,
  QuotesPanel,
  SettingsPanel,
  VisitorsPanel,
} from "../components/admin/AdminPanels";
import LoginScreen from "../components/admin/LoginScreen";
import Toast from "../components/common/Toast";
import { useStoreData } from "../hooks/useStoreData";
import { readAdminSession, writeAdminSession } from "../lib/storage";

export default function AdminPage() {
  const { products, setProducts, visitors, clearVisitorLog } = useStoreData();
  const [active, setActive] = useState("dashboard");
  const [loggedIn, setLoggedIn] = useState(() => readAdminSession());
  const [toast, setToast] = useState("");

  const pageTitle = useMemo(
    () =>
      ({
        dashboard: "Dashboard",
        visitors: "Visitor Analytics",
        products: "Product Manager",
        quotes: "Quote Requests",
        orders: "Orders",
        settings: "Settings",
      })[active],
    [active]
  );

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2400);
  };

  if (!loggedIn) {
    return (
      <>
        <LoginScreen
          onLogin={() => {
            writeAdminSession(true);
            setLoggedIn(true);
          }}
        />
        <Toast message={toast} />
      </>
    );
  }

  return (
    <div className="admin-app">
      <AdminSidebar
        active={active}
        setActive={setActive}
        onLogout={() => {
          writeAdminSession(false);
          setLoggedIn(false);
        }}
      />
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="live-pill">Live</span>
            <h1>{pageTitle}</h1>
          </div>
          <a className="secondary-btn" href="/">
            View Store
          </a>
        </header>
        {active === "dashboard" && <DashboardPanel products={products} visitors={visitors} />}
        {active === "visitors" && (
          <VisitorsPanel
            visitors={visitors}
            onClear={() => {
              clearVisitorLog();
              showToast("Visitor log cleared.");
            }}
          />
        )}
        {active === "products" && <ProductsPanel products={products} setProducts={setProducts} />}
        {active === "quotes" && <QuotesPanel visitors={visitors} />}
        {active === "orders" && <OrdersPanel />}
        {active === "settings" && <SettingsPanel />}
      </main>
      <Toast message={toast} />
    </div>
  );
}
