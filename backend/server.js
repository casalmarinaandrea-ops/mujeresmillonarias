require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

const allowedOrigins = [
  "https://casalmarinaandrea-ops.github.io",
  "https://casalmarinaandrea-ops.github.io/mujeresmillonarias",
  "http://127.0.0.1:5500",
  "http://localhost:5500"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    return callback(new Error("Origen no permitido por CORS"));
  }
}));

app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

app.get("/", (req, res) => {
  res.json({ ok: true, name: "Mujeres Millonarias Backend" });
});

app.post("/crear-preferencia", async (req, res) => {
  try {
    const { cart, customer } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    if (!customer || !customer.mail || !customer.nombre || !customer.apellido) {
      return res.status(400).json({ error: "Datos de cliente incompletos" });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: cart.map(item => ({
          title: String(item.name),
          quantity: Number(item.quantity),
          unit_price: Number(item.price),
          currency_id: "ARS"
        })),
        payer: {
          name: customer.nombre,
          surname: customer.apellido,
          email: customer.mail,
          phone: {
            number: customer.celular || ""
          },
          address: {
            street_name: customer.direccion?.calle || "",
            street_number: customer.direccion?.numero || "",
            zip_code: customer.direccion?.codigoPostal || ""
          }
        },
        shipments: {
          receiver_address: {
            street_name: customer.direccion?.calle || "",
            street_number: customer.direccion?.numero || "",
            zip_code: customer.direccion?.codigoPostal || "",
            city_name: customer.direccion?.localidad || ""
          }
        },
        back_urls: {
          success: "https://casalmarinaandrea-ops.github.io/mujeresmillonarias/",
          failure: "https://casalmarinaandrea-ops.github.io/mujeresmillonarias/",
          pending: "https://casalmarinaandrea-ops.github.io/mujeresmillonarias/"
        },
        metadata: {
          customer_name: `${customer.nombre} ${customer.apellido}`,
          customer_email: customer.mail,
          customer_phone: customer.celular,
          delivery_street: customer.direccion?.calle,
          delivery_number: customer.direccion?.numero,
          delivery_city: customer.direccion?.localidad,
          delivery_zip: customer.direccion?.codigoPostal
        },
        statement_descriptor: "MUJERES MILLONARIAS"
      }
    });

    res.json({ init_point: result.init_point });
  } catch (error) {
    console.error("Error Mercado Pago:", error);
    res.status(500).json({ error: "Error al crear la preferencia de pago" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
