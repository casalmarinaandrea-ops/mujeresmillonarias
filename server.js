require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();

app.use(cors());
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
            street_number: Number(customer.direccion?.numero || 0),
            zip_code: customer.direccion?.codigoPostal || ""
          }
        },

        back_urls: {
          success: "https://casalmarinaandrea-ops.github.io/mujeresmillonarias/",
          failure: "https://casalmarinaandrea-ops.github.io/mujeresmillonarias/",
          pending: "https://casalmarinaandrea-ops.github.io/mujeresmillonarias/"
        },

        metadata: {
          nombre: customer.nombre,
          apellido: customer.apellido,
          mail: customer.mail,
          celular: customer.celular,
          calle: customer.direccion?.calle,
          numero: customer.direccion?.numero,
          localidad: customer.direccion?.localidad,
          codigo_postal: customer.direccion?.codigoPostal
        }
      }
    });

    res.json({ init_point: result.init_point });
  } catch (error) {
    console.error("Error Mercado Pago:", error);
    res.status(500).json({
      error: "Error al crear el pago",
      detail: error.message || error
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});