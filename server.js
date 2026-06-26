// Backend opcional para Mercado Pago Checkout Pro.
// No pongas el Access Token dentro de script.js.
// Usalo en un archivo .env junto a este server.js.

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

app.post("/crear-preferencia", async (req, res) => {
  try {
    const { cart, customer } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: cart.map(item => ({
          title: item.name,
          quantity: Number(item.quantity),
          unit_price: Number(item.price),
          currency_id: "ARS"
        })),
        payer: {
          name: customer.nombre,
          surname: customer.apellido,
          email: customer.mail,
          phone: { number: customer.celular },
          address: {
            street_name: customer.direccion.calle,
            street_number: customer.direccion.numero,
            zip_code: customer.direccion.codigoPostal
          }
        },
        shipments: {
          receiver_address: {
            street_name: customer.direccion.calle,
            street_number: customer.direccion.numero,
            zip_code: customer.direccion.codigoPostal,
            city_name: customer.direccion.localidad
          }
        },
        back_urls: {
          success: "http://localhost:5500/success.html",
          failure: "http://localhost:5500/failure.html",
          pending: "http://localhost:5500/pending.html"
        }
      }
    });

    res.json({ init_point: result.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el pago" });
  }
});

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});
