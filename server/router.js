const express=require('express');
const router=express.Router();

const conexion=require('./database/db');

router.get('/client',(req,res)=>{
    conexion.query("select * from client",(error,resultado)=>{
            if(error){
                console.log(error);
                return;
            }
            else{
            res.send(resultado);
            }
    });
});

router.get('/client',(req,res)=>{
    conexion.query("select * from client",(error,resultado)=>{
            if(error){
                console.log(error);
                return;
            }
            else{
           // res.send(resultado);
            //let hola="hola y adios";
            res.render('client/index',{clientes:resultado});
            }
    });
});

//Ruta para llenar formulario de crear cliente
router.get('/crear',(req,res)=>{
    
  res.render('client/crear');
});



const metodos=require('./controllers/me');
router.post('/save',metodos.save);



router.get('/editar/:id',(req,res)=>{
const codigo=req.params.id;
conexion.query("select * from client where codigo = ?",[codigo],(error,resultado)=>{
    if (error){
        console.log(error);
        return
    }
    else{
        res.render('client/editar',{clientes:resultado}); }
        

    });    


  });
  router.post('/edit',metodos.edit);




module.exports=router;