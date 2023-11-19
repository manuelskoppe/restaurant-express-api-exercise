const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ruta GET: Recupera todos los platos desde el archivo JSON
router.get("/", (req, res) => {
  res.status(200).json(require('../data/menu.json'));
});



// Ruta POST: Agrega un nuevo plato al archivo JSON
router.post("/", (req, res) => {
  const filePath = path.join(__dirname, '..', 'data', 'menu.json');

  // Leer el archivo de datos actual
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los datos del menú." });
    }

    const plates = JSON.parse(data);
    const newId = plates.reduce((maxId, plate) => Math.max(maxId, parseInt(plate.id, 10)), 0) + 1;

    // Crea un nuevo objeto de plato con los datos del cuerpo de la solicitud
    const newPlate = { id: newId.toString(), ...req.body };

    // Añade el nuevo plato y guarda la lista actualizada
    plates.push(newPlate);
    fs.writeFile(filePath, JSON.stringify(plates, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ message: "Error al guardar el nuevo plato." });
      }
      res.status(201).json({ message: "Plate Created", data: newPlate });
    });
  });
});

// Ruta PUT: Actualiza un plato existente basado en el ID
router.put("/:id", (req, res) => {
  const filePath = path.join(__dirname, '..', 'data', 'menu.json');
  const plateId = req.params.id;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los datos del menú." });
    }

    const plates = JSON.parse(data);
    const plateIndex = plates.findIndex(p => p.id === plateId);
    if (plateIndex === -1) {
      return res.status(404).json({ message: "Plate not found" });
    }

    // Actualiza el plato y guarda los cambios
    plates[plateIndex] = { ...plates[plateIndex], ...req.body };
    fs.writeFile(filePath, JSON.stringify(plates, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ message: "Error al guardar los cambios en el plato." });
      }
      res.status(200).json({ message: "Plate Updated", data: plates[plateIndex] });
    });
  });
});

// Ruta DELETE: Elimina un plato basado en el ID
router.delete("/:id", (req, res) => {
  const filePath = path.join(__dirname, '..', 'data', 'menu.json');
  const plateId = req.params.id;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error al leer los datos del menú." });
    }

    let plates = JSON.parse(data);
    const plateIndex = plates.findIndex(plate => plate.id === plateId);
    if (plateIndex === -1) {
      return res.status(404).json({ message: "Plate not found" });
    }

    // Elimina el plato y guarda el archivo actualizado
    const [deletedPlate] = plates.splice(plateIndex, 1);
    fs.writeFile(filePath, JSON.stringify(plates, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ message: "Error al eliminar el plato." });
      }
      res.status(200).json({ message: "Plate Removed", data: deletedPlate });
    });
  });
});

module.exports = router;
