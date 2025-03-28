const msyql =require('mysql2');
const conexion=msyql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:''
});
conexion.connect((error)=>{
    if(error){
        console.error('Se presento un error'+error);
        return
    }
    console.log('Conexion Exitosa');
});
module.exports=conexion;