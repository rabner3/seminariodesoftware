const express=require('express');
const router=express.Router();

const conexion=require('./database/db');

router.get('/Cliente',(req,res)=>{
    conexion.query("select * from clientes",(error,resultado)=>{
            if(error){
                console.log(error);
                return;
            }
            else{
            res.send(resultado);
            }
    });
});

router.get('/Cliente2',(req,res)=>{
    conexion.query("select * from clientes",(error,resultado)=>{
            if(error){
                console.log(error);
                return;
            }
            else{
           // res.send(resultado);
            //let hola="hola y adios";
            res.render('cliente/index',{clientes:resultado});
            }
    });
});

//Ruta para llenar formulario de crear cliente
router.get('/crear',(req,res)=>{
    
  res.render('cliente/crear');
});



const metodos=require('./controllers/me');
router.post('/save',metodos.save);



router.get('/editar/:id',(req,res)=>{
const codigo=req.params.id;
conexion.query("select * from clientes where codigo = ?",[codigo],(error,resultado)=>{
    if (error){
        console.log(error);
        return
    }
    else{
        res.render('cliente/editar',{clientes:resultado}); }
        

    });    


  });
  router.post('/edit',metodos.edit);




module.exports=router;