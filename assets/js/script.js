$(function(){

    $('#botonBuscar').on('click',function(e){
        // Prevengo que el boton actualice la pagina
        e.preventDefault();

        // Limpiar los div en HTML para que así las siguientes busquedas puedan aparecer sin problema
        // Este paso lo agregué ya que como quitamos el preventDefault no se me ocurrió otra forma de limpiar y que no se vaya a acumular la información

        // $("#resultadoApi").remove();
        // $("#fotoSuper").remove();
        // $("#infoSuper").remove();
        // $("#chartContainer").remove();

        $(".sect_resultado").remove();

         // Obtener valor
        let superId = $('#inputSuperHero').val();
       
        // Verifico que el numero esté en el rango correcto
        if (superId>0 && superId<733){
            $.ajax({
                type: "GET",
                url: `https://www.superheroapi.com/api.php/2973630296293444/${superId}`,
                dataType: "json",
                success: function(datosApi){
                    console.log("Informacion recibida de la api", datosApi,datosApi.image)

                    // Primero agrego toda la sección en el html para agregar los datos recibidos de la API. Para la informacion usaremos una card para cumplir el requerimiento
                    $(".busqueda").append(
                        `<section class="container mt-3 sect_resultado">
                        <div class="row">
                        <div class="card justify-content-center">
                        <div class="card-body">

                        <div class="column-6" >
                        <div class="row" id="resultadoApi">
                        
                        </div>
                        <div class="row my-4">
                            <div class="col-6" id="fotoSuper">
        
                            </div>
                            <div class="col-6" id="infoSuper">
                            <ul class="list-group list-group-flush" id="lista_info"> 

                            </ul>
                            </div>
                        </div>
                    </div>

                        </div>
                        </div>
                            
                        </div>
                        <div class="row ">
                            <div id="chartContainer" style="height: 370px; width: 100%;"></div>
                        </div>
                    </section>`
                    );
                    
                    // Ahora empiezo a llenar las secciones

                    $('#resultadoApi').append(`<h3 class="ml-3"> Encontramos a tu Super! </h3>`);
                    $("#fotoSuper").append(`<img class="img-fluid" src="${datosApi.image.url}">`)
                    $('#lista_info').append(`
                    <li class="list-group-item"> <h5>Nombre</h5> ${datosApi.name} </li>
                    <li class="list-group-item"><h5>Conexiones:</h5> ${datosApi.connections['group-affiliation']}, ${datosApi.connections.relatives} </li>
                    <li class="list-group-item"><h5>Publicado por</h5> ${datosApi.biography.publisher}</li>
                    <li class="list-group-item"><h5>Ocupación</h5> ${datosApi.work.occupation}</li>
                    <li class="list-group-item"><h5>Primera Aparición</h5> ${datosApi.biography['first-appearance']}</li>
                    <li class="list-group-item"><h5>Altura</h5> ${datosApi.appearance.height[0]} - ${datosApi.appearance.height[1]}</li>
                    <li class="list-group-item"><h5>Peso</h5> ${datosApi.appearance.weight[0]} - ${datosApi.appearance.weight[1]}</li>
                    <li class="list-group-item"><h5>Alias</h5> ${datosApi.biography.aliases}</li>
                    `)

                    // Guardo datos para el grafico en un array con el formato: combat,durability,intelligence,power,speed,stength

                    var stat = [datosApi.powerstats.combat,datosApi.powerstats.durability,datosApi.powerstats.intelligence,datosApi.powerstats.power,datosApi.powerstats.speed,datosApi.powerstats.strength];

                    // Grafico

                    console.log(stat)
                    // Funcion para verificar si un elemento es distinto de null
                    const notNull = (value) => value !== 'null'; 

                    console.log(stat.every(notNull))
                    // con array.every uno puede verificar si cada elemento de un arreglo cumple algo, en este caso verifico si son distintos de null para realizar el grafico
                    if (stat.every(notNull)){

                        // Duda: Por alguna razón este codigo me estaba tirando un error si lo metía dentro del windows.load(){...} como sale en el ejemplo en CanvasJS, la verdad no entiendo bien por qué aparece ese error pero se solucionó al sacarlo. Agradecería el comentario de por qué estaba fallando
                        var options = {
                            title: {
                                text: `Estadísticas de poder para ${datosApi.name}`
                            },
                            animationEnabled: true,
                            data: [{
                                type: "pie",
                                startAngle: 40,
                                toolTipContent: "<b>{label}</b>: {y}%",
                                showInLegend: "true",
                                legendText: "{label}",
                                indexLabelFontSize: 16,
                                indexLabel: "{label} - {y}%",
                                dataPoints: [
                                    { y: stat[0], label: "Combat" },
                                    { y: stat[1], label: "Durability" },
                                    { y: stat[2], label: "Intelligence" },
                                    { y: stat[3], label: "Power" },
                                    { y: stat[4], label: "Speed" },
                                    { y: stat[5], label: "Strength" }
                                ]
                            }]
                        };
                        
                        $("#chartContainer").CanvasJSChart(options); 
                        
                    }
                    else{$("#chartContainer").append(`<h4 class="ml-3"> No tenemos suficientes estadisticas de tu super para hacer el gráfico :(</h4>`)}


                    // La siguiente linea hace un autoscroll para dejarte en el bottom de la pagina.

                    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                },
                error: function(){
                    console.log("error")
                    alert("Hubo un error en la API")
                    $('#resultadoApi').append(`<h3> Lo sentimos pero no pudimos encontrar a tu SuperHero :( </h3>`);
                }
            })     
        }
        else{
            alert('Por favor ingrese un número entre 1 y 732 (incluyendo ambos)')
        }
        
    })
})

// Comentario final: Por alguna razón hay unos superheroes que dan problema al codigo como el 22 y el 33. El container no se llena con la imagen y la información. Mi teoría es que como ambos tienen poca información, no se hace un buen display. Creo que se puede solucionar si se le da un tamaño fijo a los containers pero eso al mismo tiempo puede traer problemas con otros superheroes que tengan mucha información. No estoy seguro de cómo solucionarlo aún, cualquier comentario es bien recibido!