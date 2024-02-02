var express=require("express");
var cors=require("cors");
var path=require("path");
//var session=require("express-session"); //Se almacema en el servidor
var session=require("cookie-session");
require("dotenv").config();
var rutas=require("./rutas/usuariosRutas");
var rutasP=require("./rutas/productosRutas");
var rutasUsuariosApis=require("./rutas/usuariosRutasApis");
var rutasProductosApis=require("./rutas/productosRutasApi");

var app=express();
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    name:"session",
    keys:"holiwis",
    maxAge: 24 * 60 * 60 * 1000
}));
app.use("/", express.static(path.join(__dirname,"web")));
app.use("/", rutas);
app.use("/productos", rutasP);
app.use("/", rutasUsuariosApis);
app.use("/productos", rutasProductosApis);

var port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});
