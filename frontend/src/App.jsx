import { useEffect, useState } from "react";

const demoCredentials = {
  username: "demo",
  password: "demo123"
};

const categoryLabels = {
  BURGER: "Burger",
  PIZZA: "Pizza",
  TATLI: "Tatlı",
  ICECEK: "İçecek"
};

const statusLabels = {
  HAZIRLANIYOR: "Hazırlanıyor",
  YOLDA: "Yolda",
  TESLIM_EDILDI: "Teslim edildi"
};

const moneyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY"
});

async function getErrorMessage(response, fallbackMessage) {
  const responseText = await response.text();

  if (!responseText) {
    return fallbackMessage;
  }

  try {
    const parsedResponse = JSON.parse(responseText);
    return parsedResponse.message || fallbackMessage;
  } catch {
    return responseText;
  }
}

function App() {
  const [loginForm, setLoginForm] = useState(demoCredentials);
  const [auth, setAuth] = useState(null);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("Moda, İstanbul");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    if (!auth?.token) {
      return;
    }

    const loadDashboard = async () => {
      try {
        setIsLoadingData(true);
        setErrorMessage("");

        const [menuResponse, ordersResponse] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/orders")
        ]);

        if (!menuResponse.ok || !ordersResponse.ok) {
          throw new Error("Veriler yüklenemedi.");
        }

        const [menuData, ordersData] = await Promise.all([
          menuResponse.json(),
          ordersResponse.json()
        ]);

        setMenu(menuData);
        setOrders(ordersData);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadDashboard();
  }, [auth]);

  const groupedMenu = menu.reduce((accumulator, item) => {
    const group = accumulator[item.category] ?? [];
    group.push(item);
    accumulator[item.category] = group;
    return accumulator;
  }, {});

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const activeOrderCount = orders.filter(
    (order) => order.status !== "TESLIM_EDILDI"
  ).length;

  const averageDeliveryTime = orders.length
    ? Math.round(
        orders.reduce((sum, order) => sum + order.estimatedDeliveryMinutes, 0) /
          orders.length
      )
    : 30;

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setIsLoggingIn(true);
      setErrorMessage("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginForm)
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Giriş başarısız."));
      }

      const data = await response.json();
      setAuth(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const addToCart = (menuItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === menuItem.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: Number(menuItem.price),
          quantity: 1
        }
      ];
    });
  };

  const updateCartItemQuantity = (menuItemId, nextQuantity) => {
    setCart((currentCart) => {
      if (nextQuantity <= 0) {
        return currentCart.filter((item) => item.id !== menuItemId);
      }

      return currentCart.map((item) =>
        item.id === menuItemId ? { ...item, quantity: nextQuantity } : item
      );
    });
  };

  const handleCreateOrder = async () => {
    if (!cart.length || !auth) {
      return;
    }

    try {
      setIsSubmittingOrder(true);
      setErrorMessage("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName: auth.fullName,
          deliveryAddress,
          items: cart.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Sipariş oluşturulamadı.")
        );
      }

      const createdOrder = await response.json();
      setOrders((currentOrders) => [createdOrder, ...currentOrders]);
      setCart([]);
      setDeliveryAddress("Moda, İstanbul");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (!auth) {
    return (
      <div className="login-shell">
        <section className="login-panel">
          <div className="brand-block">
            <span className="eyebrow">Lezzet Sepeti</span>
            <h1>kent favori lezzetlerini tek ekranda yönetin.</h1>
            <p>
              Spring Boot API ve React paneli ile hızlı sipariş akışı, canlı sepet
              ve teslimat görünümü.
            </p>
          </div>

          <div className="demo-card">
            <strong>Demo hesap</strong>
            <span>Kullanıcı: demo</span>
            <span>Şifre: demo123</span>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Kullanıcı adı
              <input
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                placeholder="demo"
              />
            </label>

            <label>
              Şifre
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="demo123"
              />
            </label>

            {errorMessage ? <div className="error-box">{errorMessage}</div> : null}

            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? "Giriş yapılıyor..." : "Panele giriş yap"}
            </button>
          </form>
        </section>

        <aside className="feature-panel">
          <div className="feature-card">
            <span>Canlı menü</span>
            <strong>6 ürün, 4 kategori</strong>
            <p>Öne çıkan burger, pizza, tatlı ve içecek seçenekleri.</p>
          </div>
          <div className="feature-card">
            <span>Operasyon</span>
            <strong>30 dk ortalama teslimat</strong>
            <p>Bekleyen siparişler ve teslimat süreleri aynı panelde izlenir.</p>
          </div>
          <div className="feature-card accent">
            <span>Hazır akış</span>
            <strong>Login → Sepet → Sipariş</strong>
            <p>Kullanıcı girişinden sipariş onayına kadar tek akış.</p>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Operasyon paneli</span>
          <h1>Hoş geldin, {auth.fullName}</h1>
        </div>

        <div className="topbar-actions">
          <div className="pill">{activeOrderCount} aktif sipariş</div>
          <div className="pill">{averageDeliveryTime} dk ortalama teslimat</div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              setAuth(null);
              setCart([]);
              setOrders([]);
              setMenu([]);
            }}
          >
            Çıkış yap
          </button>
        </div>
      </header>

      {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

      <section className="summary-grid">
        <article className="summary-card">
          <span>Bugünün menüsü</span>
          <strong>{menu.length} ürün</strong>
        </article>
        <article className="summary-card">
          <span>Sepet toplamı</span>
          <strong>{moneyFormatter.format(cartTotal)}</strong>
        </article>
        <article className="summary-card">
          <span>Son teslimat tahmini</span>
          <strong>{averageDeliveryTime} dakika</strong>
        </article>
      </section>

      <main className="content-grid">
        <section className="menu-panel">
          <div className="panel-header">
            <h2>Menü</h2>
            <span>Taze hazırlanır, anında sepete eklenir.</span>
          </div>

          {isLoadingData ? <p>Menü yükleniyor...</p> : null}

          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category} className="category-group">
              <div className="category-header">
                <h3>{categoryLabels[category]}</h3>
                <span>{items.length} ürün</span>
              </div>

              <div className="menu-grid">
                {items.map((item) => (
                  <article className="menu-card" key={item.id}>
                    <div className={`image-chip ${item.imageTag}`}>
                      <span>{item.name.slice(0, 1)}</span>
                    </div>
                    <div className="menu-card-body">
                      <div className="title-row">
                        <h4>{item.name}</h4>
                        <span>{moneyFormatter.format(Number(item.price))}</span>
                      </div>
                      <p>{item.description}</p>
                      <div className="meta-row">
                        <span>{item.preparationTimeMinutes} dk</span>
                        <span>{item.rating} puan</span>
                      </div>
                      <button type="button" onClick={() => addToCart(item)}>
                        Sepete ekle
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <aside className="sidebar">
          <section className="cart-panel">
            <div className="panel-header">
              <h2>Sepet</h2>
              <span>{cart.length} kalem</span>
            </div>

            <label className="address-field">
              Teslimat adresi
              <textarea
                rows="3"
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
              />
            </label>

            <div className="cart-list">
              {cart.length ? (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{moneyFormatter.format(item.price)}</span>
                    </div>
                    <div className="cart-actions">
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">Sepetiniz boş. Menüden ürün ekleyin.</p>
              )}
            </div>

            <div className="cart-footer">
              <div>
                <span>Toplam</span>
                <strong>{moneyFormatter.format(cartTotal)}</strong>
              </div>
              <button
                type="button"
                disabled={!cart.length || isSubmittingOrder}
                onClick={handleCreateOrder}
              >
                {isSubmittingOrder ? "Sipariş gönderiliyor..." : "Siparişi tamamla"}
              </button>
            </div>
          </section>

          <section className="orders-panel">
            <div className="panel-header">
              <h2>Son siparişler</h2>
              <span>Canlı durum akışı</span>
            </div>

            <div className="orders-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-topline">
                    <strong>#{order.id}</strong>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p>{order.customerName}</p>
                  <small>{order.deliveryAddress}</small>
                  <div className="order-meta">
                    <span>{order.estimatedDeliveryMinutes} dk</span>
                    <span>{moneyFormatter.format(Number(order.totalAmount))}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default App;
