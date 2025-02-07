// @ts-nocheck
import express from 'express';
import bodyParser from 'body-parser';


import { crud } from "./server-crud.js";


const app = express();
const port =  process.env.PORT || 3001;
const USERS_URL = "./server/BBDD/users.json";
const SERVICIOS_URL = "./server/BBDD/servicios.json";





app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/hello/:nombre', (req, res) => {
  res.send(`Hola ${req.params.nombre}`);
});
 
 // CRUD
app.post('/create/servicios', (req, res) => {
  console.log("📌 Servicio recibido:", req.body);
  crud.createS(SERVICIOS_URL, req.body, (data) => {
    
    res.json(data)
  });
}) 
app.get('/read/servicios', (req, res) => {
  crud.readS(SERVICIOS_URL, (data) => {
    res.json(data);
  });
});

app.put('/update/servicios/:id', (req, res) => {
  console.log(`📌 Recibiendo actualización para servicio ID: ${req.params.id}`, req.body);
  
  crud.updateS(SERVICIOS_URL, req.params.id, req.body, (data) => {
    res.json(data)
  });
})
app.delete('/delete/servicios/:id', async (req, res) => {
  console.log(`📌 Eliminando servicio con ID: ${req.params.id}`);

  await crud.deleteS(SERVICIOS_URL, req.params.id, (data) => {
    res.json(data)
  }); 
})
app.post('/create/users', (req, res) => {
    crud.createU(USERS_URL, req.body, (data) => {
      res.json(data)
    });
  })
app.get('/read/users', (req, res) => {
    crud.readU(USERS_URL, (data) => {
      res.json(data)
    });
  })
app.put('/update/users/:id', (req, res) => {
    console.log("📌 Recibida actualización para usuario ID:", req.params.id);
    console.log("📩 Datos recibidos:", req.body);

    crud.updateU(USERS_URL, req.params.id, req.body, (data) => {
        if (!data) {
            console.error("❌ Error: No se pudo actualizar el usuario.");
            return res.status(500).json({ error: "No se pudo actualizar el usuario." });
        }
        console.log("✅ Usuario actualizado en la base de datos:", data);
        res.json(data);
    });
});


app.delete('/delete/users/:id', async (req, res) => {
    await crud.deleteU(USERS_URL, req.params.id, (data) => {
      res.json(data)
    });
  })
app.listen(port, () => {
  console.log(`Servicios listening on port ${port}`)
})