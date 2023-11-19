const express = require("express");
const app = express();
const PORT = 3000;

const platesRoutes = require("./routes/plates"); // Asegúrate de que la ruta esté correcta

app.use(express.json());

// Aquí se utiliza el módulo de rutas 'plates'
// Todas las rutas definidas en 'plates.js' tendrán un prefijo '/plates'
app.use("/plates", platesRoutes); // Corregido: "/plates" en lugar de "/.plates.js"

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT} 🚀`);
});
