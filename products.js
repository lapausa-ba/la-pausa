/* ===== EDITÁ ACÁ: configuración y productos =====
   ⚠️ Los productos de abajo son DE DEMOSTRACIÓN (nombres, precios y stock ficticios). */
const CONFIG = {
  whatsapp: "5491164957343",      // ← tu número: código de país + área + número, sin + ni espacios
  instagram: "lapausa.ba",
  preparacion: "Se preparan a pedido: 5 a 7 días hábiles.",
  retiro: "Retiro coordinado por WhatsApp.",
  pagos: "Transferencia o efectivo al retirar. Se confirma por WhatsApp."
};
// Colores: clave → nombre y hex (se usan como muestra y como ilustración si no hay foto)
const COLORES = {
  crudo:{n:"Crudo",hex:"#E6DDCB"}, arena:{n:"Arena",hex:"#C9B493"}, negro:{n:"Negro",hex:"#1E1E1C"},
  gris:{n:"Gris",hex:"#8D8C88"}, tierra:{n:"Tierra",hex:"#86684D"}, blanco:{n:"Blanco natural",hex:"#F5F2EA"}
};
/* Fotos propias: poné los archivos en la carpeta img/ y listalos por color:
   fotos:{ crudo:["img/pausa-crudo-1.jpg","img/pausa-crudo-2.jpg"] }
   Si un color no tiene fotos, se muestra una ilustración de referencia. */
const PRODUCTOS = [
 { id:"pausa", nombre:"Remera Pausa", tipo:"Estampa sutil", precio:24000, destacado:true, disponible:true,
   descripcion:"Algodón peinado de caída suave, corte unisex relajado. Isotipo pequeño estampado en DTF sobre el pecho.",
   colores:["crudo","negro","arena"], talles:["S","M","L","XL"], disenos:["Isotipo pecho","Sin estampa"], fotos:{},
   stock:{ crudo:{S:4,M:6,L:3,XL:0}, negro:{S:2,M:5,L:5,XL:2}, arena:{S:0,M:3,L:2,XL:1} } },
 { id:"silencio", nombre:"Remera Silencio", tipo:"Gráfica", precio:26500, destacado:true, disponible:true,
   descripcion:"Estampa gráfica discreta en la espalda alta. Algodón de gramaje medio, cuello reforzado.",
   colores:["blanco","tierra","gris"], talles:["S","M","L","XL"], disenos:["Espalda alta"], fotos:{},
   stock:{ blanco:{S:3,M:4,L:4,XL:2}, tierra:{S:1,M:2,L:0,XL:0}, gris:{S:5,M:5,L:3,XL:1} } },
 { id:"horizonte", nombre:"Remera Horizonte", tipo:"Gráfica", precio:26500, destacado:true, disponible:true,
   descripcion:"Línea de horizonte minimalista al frente. Pensada para usar sola o en capas.",
   colores:["negro","crudo"], talles:["M","L","XL"], disenos:["Frente","Manga"], fotos:{},
   stock:{ negro:{M:4,L:4,XL:3}, crudo:{M:2,L:3,XL:2} } },
 { id:"lisa", nombre:"Remera Lisa", tipo:"Lisa", precio:19000, destacado:false, disponible:false,
   descripcion:"La básica sin estampa. Próxima reposición.",
   colores:["crudo","arena","negro"], talles:["S","M","L","XL"], disenos:[], fotos:{},
   stock:{ crudo:{S:0,M:0,L:0,XL:0}, arena:{S:0,M:0,L:0,XL:0}, negro:{S:0,M:0,L:0,XL:0} } }
];
