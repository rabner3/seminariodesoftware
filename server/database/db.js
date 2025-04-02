const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'proyecto',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
conexion.connect((error)=>{
    if(error){
        console.error('Se presento un error'+error);
        return
    }
    console.log('Conexion Exitosa');
});
module.exports=conexion;