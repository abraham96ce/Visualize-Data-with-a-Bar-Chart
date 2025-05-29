// Dimensiones del SVG y espacio para los ejes
const width = 800;
const height = 400;
const padding = 60;

// Crea el SVG dentro del contenedor con id "chart"
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Carga el dataset JSON con los datos de GDP
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(data => {
  const dataset = data.data; // Array de pares [fecha, GDP]

  // Crea escala temporal para el eje X
  // El dominio es desde la fecha mínima hasta la fecha máxima
  // El rango es el ancho disponible en SVG (con padding a los lados)
  const xScale = d3.scaleTime()
    .domain([
      new Date(d3.min(dataset, d => d[0])), // fecha mínima
      new Date(d3.max(dataset, d => d[0]))  // fecha máxima
    ])
    .range([padding, width - padding]);

  // Crea el eje X usando la escala temporal
  const xAxis = d3.axisBottom(xScale);

  // Añade el eje X al SVG en la posición correcta (al fondo)
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`) // mover eje al fondo del SVG
    .call(xAxis);

  // Crea escala lineal para el eje Y (GDP)
  // El dominio es de 0 al máximo GDP del dataset
  // El rango es del fondo (altura) hacia arriba (padding)
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])]) // dominio: 0 a GDP máximo
    .range([height - padding, padding]);    // rango invertido porque el SVG tiene origen arriba

  // Crea eje Y usando la escala lineal
  const yAxis = d3.axisLeft(yScale);

  // Añade el eje Y al SVG a la izquierda, con padding
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`) // mueve eje a la izquierda con padding
    .call(yAxis);

  // Define el ancho de cada barra con un pequeño espacio entre barras (barPadding)
  const barPadding = 1;
  const barWidth = (width - 2 * padding) / dataset.length;

  // Selecciona el div tooltip para mostrar datos al pasar el cursor
  const tooltip = d3.select("#tooltip");

  // Crea las barras del gráfico
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar") // clase para estilos CSS
    // Posición horizontal de la barra: 
    // padding + índice * ancho barra
    .attr("x", (d, i) => padding + i * barWidth)
    // Posición vertical: usando la escala Y para el valor de GDP
    .attr("y", d => yScale(d[1]))
    // Ancho de la barra menos el padding entre barras
    .attr("width", barWidth - barPadding)
    // Altura: diferencia entre el fondo y la posición Y calculada
    .attr("height", d => height - padding - yScale(d[1]))
    // Atributos personalizados requeridos para tests y tooltip
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    // Evento mouseover para mostrar tooltip con info detallada
    .on("mouseover", function(event, d) {
      tooltip
        .style("opacity", 1)            // hacer visible el tooltip
        .attr("data-date", d[0])        // setear data-date para test
        // muestra fecha y GDP formateado con comas y texto en HTML
        .html(`<strong>${d[0]}</strong><br>$${d[1].toLocaleString()} Billion`);
    })
    // Evento mousemove para posicionar el tooltip cerca del cursor
    .on("mousemove", function(event) {
      tooltip
        .style("left", event.pageX + 10 + "px")  // posición horizontal
        .style("top", event.pageY - 40 + "px");  // posición vertical
    })
    // Evento mouseout para ocultar el tooltip cuando se quita el cursor
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    });
});
