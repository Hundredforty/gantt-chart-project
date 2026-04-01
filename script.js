let tasks = [];

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
];

const startDate = new Date('2023-05-01');
const endDate = new Date('2023-06-30');

const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

const svg = d3.select("#gantt-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width]);

const y = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, height])
    .padding(0.1);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y))
  .selectAll("text")
    .attr("x", -5)
    .attr("y", 5)
    .attr("dy", ".35em")
    .attr("transform", "rotate(-90)");

const u = svg.append("g");

data.forEach(d => {
  u.append("rect")
      .attr("x", x(startDate))
      .attr("y", y(d.name))
      .attr("width", d.uv - startDate)
      .attr("height", y.bandwidth())
      .style("fill", "steelblue");
});

const form = document.getElementById('task-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskName = e.target[0].value;
    const startDate = new Date(e.target[1].value);
    const endDate = new Date(e.target[2].value);
    tasks.push({ name: taskName, uv: endDate });
    updateChart();
});

function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

window.addEventListener('beforeunload', function(event) {
    const backup = confirm('是否要備份當前數據？');
    if (backup) {
        saveData();
    }
});

function updateChart() {
    svg.selectAll("rect").remove();
    tasks.forEach(d => {
        u.append("rect")
            .attr("x", x(startDate))
            .attr("y", y(d.name))
            .attr("width", d.uv - startDate)
            .attr("height", y.bandwidth())
            .style("fill", "steelblue");
    });
}

window.addEventListener('load', function() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        updateChart();
    }
});
