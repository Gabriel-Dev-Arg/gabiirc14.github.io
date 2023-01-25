//llamado al carrito
let carrito = []
const contenedor = document.querySelector("#contenedor")
const carritoContenedor = document.querySelector("#carritoContenedor")
const vaciarCarrito = document.querySelector("#vaciarCarrito")
const precioTotal = document.querySelector("#precioTotal")
const procesarCompra = document.querySelector("#procesarCompra")

//guardado de datos en el localStorage
document.addEventListener("DOMContentLoaded",() => {
  carrito = JSON.parse(localStorage.getItem("carrito")) || []
  mostrarCarrito()
})

const peticion = async () => {
  const resp = await fetch("/datos.json");
  const data = await resp.json();

  return data
}

const catalogo = async() =>{
  let data =  await peticion();

  data.forEach(producto => {
    const{id, nombre, precio, cantidad,img} = producto
    contenedor.innerHTML += `<div class="card " style="width: 18rem; ">
    <img class="card-img-top mt-2" src="${img}"  alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${nombre}</h5>
      <p class="card-text">Precio: ${precio}</p>
      <p class="card-text">Cantidad: ${cantidad}</p>
      <button class="btn btn-primary buttonComprar" onclick="agregarProducto(${id})">Comprar Producto</button>
    </div>
  </div>`;

  }) 
}

catalogo();


//asignacion evento click para la continuacion de compra
procesarCompra.addEventListener("click",()=>{
if(carrito.length === 0){
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Para continuar , comprar algo!',
  })
  
}else{
  location.href = "compra.html"
}
})
// evento vaciar carro boton
vaciarCarrito.addEventListener("click",() => {
  if(carrito.length ===0){
    Swal.fire({
      icon: 'error',
      title: 'Para vaciar debes comprar',
    })
  }
  carrito.length = []
  mostrarCarrito()
})


//funcion agregar producto y sumar la cantidad de producto
const agregarProducto = async(id) => {
  let data = await peticion();
  const existe = carrito.some(prod => prod.id === id)

  if(existe){
    const prod = carrito.map(prod => {
      if(prod.id === id){
        prod.cantidad++
      }
    })
  } else {
    const item = data.find((prod)=> prod.id === id)
  carrito.push(item)

  }
  mostrarCarrito()
  /* console.log(item) */
}

const mostrarCarrito = ()=> {
    const modalBody = document.querySelector(".modal .modal-body")
  modalBody.innerHTML = ""
    carrito.forEach((prod) => {
      const{id, nombre, precio, cantidad,img} = prod
      modalBody.innerHTML += `<div class="modal-contenedor">
      <div>
      <img class="img-fluid img-carrito" src="${img}"/>
      </div>
      <div>
      <p>Producto: ${nombre}</p>
    <p>Precio: ${precio}</p>
    <p>Cantidad :${cantidad}</p>
    <button class="btn btn-danger" onclick="eliminarProducto(${id})">Eliminar producto</button>
      </div>
    </div>`
    })
    if(carrito.length === 0){
      modalBody.innerHTML = `<p class ="text-center text-primary parrafo">Aun no agregaste nada!</p>`
    }else 
      console.log("hay algo")

    carritoContenedor.textContent = carrito.length;

    precioTotal.innerText = carrito.reduce((acmulador, prod) =>
    acmulador+ prod.cantidad * prod.precio, 0)

    guardarStorage()

    
}

//funcion elimiar producto
function eliminarProducto(id) {
  const juegoId = id;
  carrito = carrito.filter((juego) => juego.id !== juegoId);
  /* console.log(carrito) */
  mostrarCarrito();
}


function guardarStorage(){
  localStorage.setItem("carrito", JSON.stringify(carrito))
}