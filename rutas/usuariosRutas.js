var rutas=require("express").Router();
var {mostrarUsuario, nuevoUsuario, modificarUduario, buscarPorID, borrarUsuario, login}=require("../bd/usuariosbd");
var subirArchivo=require("../middlewares/subirArchivo");
const fs = require('fs');

rutas.get("/",(req, res)=>{
    res.render("paginas/login");
});

rutas.post("/login",async(req, res)=>{
    var user = await login(req.body);
    if(user==undefined){
        res.redirect("/");
    } else { 
        req.session.usuario=user.usuario;
        res.redirect("/mostrar");

    }
});

rutas.get("/mostrar",async(req, res)=>{
    /*if(req.session.usuario){*/
        var usuarios = await mostrarUsuario();
        res.render("usuarios/mostrar",{usuarios});
   /* } else{
        res.redirect("/");
    }*/
});

rutas.get("/nuevoUsuario", (req,res)=>{
    res.render("usuarios/nuevo");
});

rutas.post("/nuevoUsuario",subirArchivo(), async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    res.redirect("/");
});

rutas.get("/editar/:id",async(req,res)=>{
    if(req.session.usuario){
        var user=await buscarPorID(req.params.id);
        res.render("usuarios/modificar",{user});
    } else{
        res.redirect("/");
    }
});

rutas.post("/editar",subirArchivo(), async(req,res)=>{
    if(req.file!=undefined){
        req.body.foto=req.file.originalname;
        try {
            fs.unlinkSync(`web/images/${req.body.fotoVieja}`);
        } catch (error) {
            console.error("Error al borrar la foto o usuario:", error);
        }
    } else{
        req.body.foto=req.body.fotoVieja;
    }
    var error=await modificarUduario(req.body);
    res.redirect("/"); 
});

rutas.get("/borrar/:id", async (req, res) => {
    var user= await buscarPorID(req.params.id);
    try {
        fs.unlinkSync(`web/images/${user.foto}`);
        await borrarUsuario(req.params.id);
    } catch (error) {
        console.error("Error al borrar la foto o usuario:", error); 
    }
    res.redirect("/");
});

rutas.get("/logout",(req,res)=>{
    req.session=null;
    res.redirect("/");
});

module.exports=rutas;