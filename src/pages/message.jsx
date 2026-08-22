import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = "https://pizza-api-pj4j.onrender.com";
const API_URL = `${API_BASE_URL}/api/v1/pizzas`;

const PRODUCT_NAMES = [
  "Пепперони Фреш", "Четыре сыра", "Вегетарианская", "Барбекю с курицей",
  "Острая мексиканская", "Грибная с чесноком", "Томатная буррата", "Цыплёнок ранч",
  "Гавайская", "Мясной пир", "Средиземноморская", "Сырный цыплёнок",
  "Овощная гриль", "Охотничья", "Сладкая карамель", "Пикантная салями",
  "Деревенская", "Моцарелла и томаты", "Курица терияки", "Острая колбаска",
];

const PRODUCT_DESCRIPTIONS = [
  "Нежная моцарелла, свежие томаты и ароматный соус",
  "Сочная начинка, хрустящая корочка и много сыра",
  "Пикантные специи, запечённые овощи и фирменный соус",
  "Курица, душистые травы и румяная сырная корочка",
  "Сбалансированный вкус для большой компании",
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createGeneratedProduct(name) {
  const isChicken = Math.random() > 0.58;
  const isSpicy = Math.random() > 0.62;
  const isVegetarian = !isChicken && Math.random() > 0.45;

  return {
    title: name,
    description: randomItem(PRODUCT_DESCRIPTIONS),
    price: 450 + Math.floor(Math.random() * 10) * 50,
    doughType: Math.random() > 0.35 ? "traditional" : "thin",
    canCustomise: Math.random() > 0.7,
    isNew: Math.random() > 0.65,
    isMeat: !isVegetarian && !isChicken && Math.random() > 0.35,
    isSpicy,
    isSweet: Math.random() > 0.9,
    isVegetarian,
    isChicken,
    hasCheeseSauce: Math.random() > 0.55,
    hasMozzarella: true,
    hasGarlic: Math.random() > 0.55,
    hasPickles: Math.random() > 0.75,
    hasRedOnion: Math.random() > 0.6,
    hasTomatoes: Math.random() > 0.4,
  };
}

async function getBlobHash(blob) {
  const buffer = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function downloadUniquePizzaImage(title, usedHashes) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const lock = Math.floor(Math.random() * 1000000000) + attempt;
    const url = `https://loremflickr.com/800/800/pizza?lock=${lock}`;
    const response = await axios.get(url, { responseType: "blob" });
    const hash = await getBlobHash(response.data);

    if (!usedHashes.has(hash)) {
      return {
        file: new File([response.data], `${title}.jpg`, { type: "image/jpeg" }),
        hash,
      };
    }
  }

  throw new Error("Не удалось найти уникальное изображение");
}

function createGeneratedProducts(count) {
  const names = [...PRODUCT_NAMES].sort(() => Math.random() - 0.5).slice(0, count);
  return names.map((name, index) => ({
    ...createGeneratedProduct(name),
    imageUrl: `https://loremflickr.com/800/800/pizza?lock=${Date.now() + index}`,
  }));
}

function Panel() {
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const initialFormState = {
    title: "",
    description: "",
    price: "",
    doughType: "traditional",
    canCustomise: false,
    isNew: false,
    isMeat: false,
    isSpicy: false,
    isSweet: false,
    isVegetarian: false,
    isChicken: false,
    hasCheeseSauce: false,
    hasMozzarella: false,
    hasGarlic: false,
    hasPickles: false,
    hasRedOnion: false,
    hasTomatoes: false,
  };

  const [form, setForm] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(Array.isArray(response.data) ? response.data : response.data.data ?? []);
    } catch (error) {
      console.error("Ошибка при загрузке пицц:", error);
    }
  };

  useEffect(() => {
    const request = Promise.resolve().then(fetchProducts);

    return () => {
      void request;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот товар?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage("Товар успешно удален!");
      fetchProducts();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      setMessage("Не удалось удалить товар");
    }
  };

  const handleDeleteAll = async () => {
    if (products.length === 0) {
      setMessage("В каталоге нет товаров для удаления");
      return;
    }

    if (!window.confirm(`Удалить все товары (${products.length})?`)) return;

    setMessage("");
    setIsLoading(true);

    try {
      const results = await Promise.allSettled(
        products.map((product) => axios.delete(`${API_URL}/${product.id}`))
      );
      const deletedCount = results.filter((result) => result.status === "fulfilled").length;
      const failedCount = results.length - deletedCount;

      await fetchProducts();
      setMessage(
        failedCount === 0
          ? `Удалено товаров: ${deletedCount}`
          : `Удалено товаров: ${deletedCount}. Не удалось удалить: ${failedCount}`
      );
    } catch (error) {
      console.error("Ошибка массового удаления:", error);
      setMessage("Не удалось удалить товары");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Пожалуйста, выберите файл картинки!");
      return;
    }

    // Сохраняем ссылку на форму ДО выполнения async/await
    const targetForm = e.currentTarget;

    setMessage("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("image", file);

      await axios.post(API_URL, formData);

      setMessage("Товар успешно добавлен!");
      setFile(null);
      setForm(initialFormState);

      // Безопасный сброс HTML-полей формы
      targetForm.reset();
      await fetchProducts();
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);
      const detail = error.response?.data?.detail;
      setMessage(
        typeof detail === "string" 
          ? detail 
          : "Не удалось добавить товар"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setMessage("");
    setIsLoading(true);

    try {
      const generatedProducts = createGeneratedProducts(12);
      const savedHashes = JSON.parse(localStorage.getItem("generatedPizzaImageHashes") || "[]");
      const usedHashes = new Set(savedHashes);
      let createdCount = 0;
      let failedCount = 0;

      await Promise.allSettled(products.map(async (product) => {
        if (!product.imageUrl) return;
        const response = await axios.get(getImageUrl(product.imageUrl), { responseType: "blob" });
        usedHashes.add(await getBlobHash(response.data));
      }));

      for (const product of generatedProducts) {
        try {
        const formData = new FormData();
        const productData = { ...initialFormState, ...product };

        delete productData.imageUrl;

        Object.keys(productData).forEach((key) => {
          formData.append(key, productData[key]);
        });
        const image = await downloadUniquePizzaImage(product.title, usedHashes);
        formData.append("image", image.file);
        await axios.post(API_URL, formData);
        usedHashes.add(image.hash);
        createdCount += 1;
        } catch (error) {
          failedCount += 1;
          console.error(`Ошибка добавления ${product.title}:`, error);
        }
      }

      localStorage.setItem("generatedPizzaImageHashes", JSON.stringify([...usedHashes]));

      setMessage(failedCount === 0
        ? `Автоматически добавлено товаров: ${createdCount}`
        : `Добавлено товаров: ${createdCount}. Не удалось: ${failedCount}`);
      await fetchProducts();
    } catch (error) {
      console.error("Ошибка автогенерации:", error);
      setMessage("Не удалось автоматически добавить товары");
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Управление товарами</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Добавить новый товар</h2>

        <div style={styles.inputGroup}>
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Пепперони Фреш"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Описание:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Пикантное пепперони, моцарелла..."
            rows="3"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Цена (₽):</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="490"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Выберите изображение:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Тип теста:</label>
          <select name="doughType" value={form.doughType} onChange={handleChange}>
            <option value="traditional">Традиционное</option>
            <option value="thin">Тонкое</option>
          </select>
        </div>

        <fieldset style={styles.fieldset}>
          <legend>Опции и категории (Boolean)</legend>
          <label><input type="checkbox" name="canCustomise" checked={form.canCustomise} onChange={handleChange} /> Можно собирать</label>
          <label><input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} /> Новинка</label>
          <label><input type="checkbox" name="isMeat" checked={form.isMeat} onChange={handleChange} /> Мясные</label>
          <label><input type="checkbox" name="isSpicy" checked={form.isSpicy} onChange={handleChange} /> Острые</label>
          <label><input type="checkbox" name="isSweet" checked={form.isSweet} onChange={handleChange} /> Сладкие</label>
          <label><input type="checkbox" name="isVegetarian" checked={form.isVegetarian} onChange={handleChange} /> Вегетарианские</label>
          <label><input type="checkbox" name="isChicken" checked={form.isChicken} onChange={handleChange} /> С курицей</label>
        </fieldset>

        <fieldset style={styles.fieldset}>
          <legend>Ингредиенты (Boolean)</legend>
          <label><input type="checkbox" name="hasCheeseSauce" checked={form.hasCheeseSauce} onChange={handleChange} /> Сырный соус</label>
          <label><input type="checkbox" name="hasMozzarella" checked={form.hasMozzarella} onChange={handleChange} /> Моцарелла</label>
          <label><input type="checkbox" name="hasGarlic" checked={form.hasGarlic} onChange={handleChange} /> Чеснок</label>
          <label><input type="checkbox" name="hasPickles" checked={form.hasPickles} onChange={handleChange} /> Солёные огурчики</label>
          <label><input type="checkbox" name="hasRedOnion" checked={form.hasRedOnion} onChange={handleChange} /> Красный лук</label>
          <label><input type="checkbox" name="hasTomatoes" checked={form.hasTomatoes} onChange={handleChange} /> Томаты</label>
        </fieldset>

        <button type="submit" disabled={isLoading} style={styles.submitBtn}>
          {isLoading ? "Загрузка..." : "Добавить товар"}
        </button>

        {message && <p style={{ marginTop: "10px", color: message.includes("успешно") ? "green" : "red" }}>{message}</p>}
      </form>

      <button type="button" disabled={isLoading} onClick={handleGenerate} style={styles.generateBtn}>
        {isLoading ? "Генерация..." : "Сгенерировать товары"}
      </button>

      <button type="button" disabled={isLoading || products.length === 0} onClick={handleDeleteAll} style={styles.deleteAllBtn}>
        {isLoading ? "Удаление..." : "Удалить все товары"}
      </button>

      <hr style={{ margin: "40px 0" }} />

      <h2>Каталог товаров</h2>
      <div style={styles.grid}>
        {products.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.imageWrapper}>
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.title}
                style={styles.image}
              />
            </div>
            <h3 style={styles.title}>{item.title}</h3>
            <p style={styles.description}>{item.description}</p>
            <div style={styles.cardFooter}>
              <span style={styles.price}>от {item.price} ₽</span>
              <div style={styles.actionGroup}>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={styles.deleteBtn}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "500px",
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fieldset: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
  },
  submitBtn: {
    padding: "12px",
    backgroundColor: "#ff6900",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  generateBtn: {
    marginTop: "12px",
    padding: "12px 18px",
    backgroundColor: "#fff0e6",
    color: "#d94f00",
    border: "1px solid #ff6900",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  deleteAllBtn: {
    marginTop: "12px",
    marginLeft: "8px",
    padding: "12px 18px",
    backgroundColor: "#fff1f1",
    color: "#d9363e",
    border: "1px solid #ff4d4f",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "30px",
    marginTop: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid #eee",
    borderRadius: "18px",
    padding: "12px",
  },
  imageWrapper: {
    backgroundColor: "#fff0e6",
    borderRadius: "14px",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "12px",
  },
  image: {
    width: "100%",
    maxWidth: "220px",
    height: "220px",
    objectFit: "contain",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
  },
  description: {
    fontSize: "13px",
    color: "#828282",
    lineHeight: "1.3",
    margin: "0 0 16px 0",
    flexGrow: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  actionGroup: {
    display: "flex",
    gap: "8px",
  },
  deleteBtn: {
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Panel;