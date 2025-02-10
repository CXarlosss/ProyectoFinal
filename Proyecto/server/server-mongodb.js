//@ts-nocheck



export const db = {
    servicios:{
        get: getservicios,
        create: createServicios,
        count: countServicios,
        update: updateServicios,
        delete:releteServicios

    }
,checkConnection
}

function checkConnection() {
    const user = new
    const serviciosListDB =  user.db('Servicios');
    const usersListDB =  user.db('Users');
    const serviciosList =  serviciosListDB.collection('Servicios');
    const usersList =  usersListDB.collection('Users');
}

