(function myBlog() { /*Función que definirá el espacio global*/
	document.addEventListener("DOMContentLoaded", function(event) { /*Se ejecuta hasta que el contenido de la página se cargue totalmente (img, ect)*/
		
		/*Objeto que contiene todas las funciones del documento.*/
		var app = {
			DOMapi: domApiFunc(),
			DataApi: dataApiFunc(),
			addMenu: addMenuFunc,
			addSections: addSectionsFunc,
			registerEventsFunc: registerEventsFunc,
			sections: null,
			menu: null,
			init: init
		}
        //Se manda llamar la función init
		app.init();


		function init () {
			this.addMenu(); //Manda a llamar la función: addMenuFunc
			this.addSections();
			this.registerEventsFunc();
		}

		function addMenuFunc() {
			function buildMenu(){ //Está función construye el menú, por medio del dom y su función createElement.
				var container = this.DOMapi.getContainer("main-nav");//Contiene el navegador que contendrá al menú.
				var newNav = document.createElement("nav"); //Genera la etiqueta del navegador.
				var newList = document.createElement("ul"); //Genera la estructura de la lista que contendrá al menú.
				newNav.appendChild(newList); //La lista se coloca adentro del navegador.
				container.appendChild(newNav); //El contenedor agrega al navegador que ya contiene la estructura de la lista <ul>.
				
				function addList(item, index) {
					var index = index + 1;
					newList.innerHTML += "<li>"+(item.title + " " + index)+"</li>"; //Se agregan los titulos del menú
				}
				//menu es el nombre del objeto que contiene los titulos en el archivo json, el indice se agrega por medio de un contadro
				this.DOMapi.addItems(this.menu, addList); 
			}
            //Función que agrega el menu y las secciones al documento
			function addMenuToDOM(object) {
				this.sections = object.data.sections;
				this.menu = object.data.menu;
				buildMenu.call(this);
			}
			this.DataApi.getData(addMenuToDOM.bind(this));
		}

		function addSectionsFunc() {
			var actual = this;
			var observer = setInterval(function() {
				if(actual.sections){
					clearInterval(observer);
					var container = actual.DOMapi.getContainer("main-sections-container"); //Obtiene el contenedor donde van los articulos
					function addItems(item, index) {
						var index = index + 1;
						var section = document.createElement("section");
						var header = document.createElement("header");
						header.appendChild(document.createElement("h2"));
						header.children[0].textContent = item.title;
						var viewButton = document.createElement("div");
						viewButton.classList.add('full');
						var iconButton = document.createElement("span");
						viewButton.appendChild(document.createElement("span"));
						viewButton.children[0].textContent = "more";
						var article = document.createElement("article");
						var image = document.createElement("img");
						image.src = item.image;
						article.appendChild(image);
						var articleText = document.createElement("p");
						articleText.textContent = item.article;
						article.appendChild(articleText);
						section.appendChild(header);
						section.appendChild(viewButton);
						section.appendChild(article);
						container.appendChild(section);
					}
					actual.DOMapi.addItems(actual.sections, addItems);
				}
			},1)
		};

		function domApiFunc(){
			function getContainer (id) {
				return document.getElementById(id); //Regresa el elemento de acuerdo al id que recibe como parametro
			}

			function addItems (items, callback) {
				for(var i = 0; i < items.length; i++) {
					callback(items[i], i);
				};
			}
			var publicAPI = {
				getContainer: getContainer,
				addItems: addItems
			}
			return publicAPI;
		};
  
       //La función dataApiFunc hace los procedimientos necesarios para obtener la información almacenada en formato json.
		function dataApiFunc() {
			var URLs = { //Objeto que contendra la dirección de donde se obtendra la información de json.
				get: "datos/sections.json",
				post: "nothing yet"
			}
			//Función que obtiene los elementos por medio de un json
			function getData(callback) {
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status ==200) {
							callback(JSON.parse(xmlhttp.responseText));
					}
				}
				xmlhttp.open("GET", URLs.get, true); //Para que sea asíncrono
				xmlhttp.send();
				} //Fin dela función getData

			var publicAPI = {
				getData: getData//,
				//sendData: sendData
			}
			return publicAPI;
	   }; //Fin de la función dataApiFunc
	   
	    //Función que manipula el menu y los articulos cuando se presiona el boton de hamburguesa
	   function registerEventsFunc()
	   {
		  //Objeto que manejara el boton del menu 
		  var obj = document.getElementById('boton');
		  //Objeto que manejara el contenedor de secciones
		  var contSecciones = document.getElementById('main-sections-container');
		  //Objeto que manejara el contenedor del menu
		  var contMenu = document.getElementById('main-nav');
			obj.addEventListener('touchstart', function(event) {
				if(contSecciones.style.display == 'none'){ 
                    obj.style.transform = "rotate(0deg)";
					contSecciones.style.display = "block";
					contMenu.style.display = "none";
                }
				else{
					obj.style.transform = "rotate(90deg)";
					contSecciones.style.display = "none";
					contMenu.style.display = "block";
				}
				
			}, false);
			
	   } //Fin de la función registerEventsFunc
	})
	
	//Función que detecta cuando se está en el celular o en PC
	//La utilizo porque al cambiar el tamño de celular a PC, si previamente presioné el boton de hamburguesa, se cambia la visibilidad de los contenedores.
    window.onresize = resize;
	function resize()
	{
	   var contSecciones = document.getElementById('main-sections-container');
	   var contMenu = document.getElementById('main-nav');
	   var obj = document.getElementById('boton');
		  
	   if(screen.width>375){
		  
		  contSecciones.style.display = "block";
	      contMenu.style.display = "block";
	   }
	   if(screen.width<376){
		  contSecciones.style.display = "block";
	      contMenu.style.display = "none"; 
		  obj.style.transform = "rotate(0deg)";
	   }
	}
		
	//Uso este if para que siempre sean visibles los contenedores, si es que se está viendo desde la PC y no del Iphone 6
})();