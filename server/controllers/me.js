const conexion =require('../database/db');

exports.save=(req,res)=>{
    const nombre=(req.body.nombre);
    const apellido=(req.body.apellido);
    const edad=(req.body.edad);
    const telefono=(req.body.telefono);
    const cuidad=(req.body.cuidad);
    
    conexion.query('insert into client set ?', {nombre:nombre,apellido:apellido,edad:edad,
    telefono:telefono,cuidad:cuidad},(error,resultado=>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/client')
        }


    }
    
    ));


}

exports.edit=(req,res)=>{
    const codigo=(req.body.codigo);
    const nombre=(req.body.nombre);
    const apellido=(req.body.apellido);
    const edad=(req.body.edad);
    const telefono=(req.body.telefono);
    const cuidad=(req.body.cuidad);
    
    conexion.query("update client set  ?  where codigo =?",[{nombre:nombre,apellido:apellido,edad:edad,
        telefono:telefono,cuidad:cuidad},codigo],(error,resultado)=>{
            if(error){
                console.log(error);
            }
            else{
                res.redirect('/client')
            }

                    
    });
 
}

    exports.eliminar=(req,res)=>{
        const codigo=(req.body.codigo);
        const nombre=(req.body.nombre);
        const apellido=(req.body.apellido);
        const edad=(req.body.edad);
        const telefono=(req.body.telefono);
        const cuidad=(req.body.cuidad);
        
        conexion.query("update client set  ?  where codigo =?",[{nombre:nombre,apellido:apellido,edad:edad,
            telefono:telefono,cuidad:cuidad},codigo],(error,resultado)=>{
                if(error){
                    console.log(error);
                }
                else{
                    res.redirect('/client')
                }
    
               
        });

}

        exports.ver=(req,res)=>{
            const codigo=(req.body.codigo);
            const nombre=(req.body.nombre);
            const apellido=(req.body.apellido);
            const edad=(req.body.edad);
            const telefono=(req.body.telefono);
            const cuidad=(req.body.cuidad);
            
            conexion.query("update client set  ?  where codigo =?",[{nombre:nombre,apellido:apellido,edad:edad,
                telefono:telefono,cuidad:cuidad},codigo],(error,resultado)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                        res.redirect('/client')
                    }
        
                   
            });
        
    

};
