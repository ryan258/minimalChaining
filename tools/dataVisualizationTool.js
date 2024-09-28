// dataVisualizationTool.js

// We're bringing in a special artist friend who's really good at drawing charts
const ChartJsImage = require('chartjs-to-image');  // This is like a magical paintbrush for making charts!

/**
 * This is our magic function that can draw a beautiful bar chart
 * @param {string} title - This is the name we want to give our chart
 * @param {string[]} labels - These are the names for each bar in our chart
 * @param {number[]} data - These are the heights for each bar in our chart
 * @return {Promise<string>} - This is the magic spell (Promise) that will give us a picture of our chart
 */
async function createBarChart(title, labels, data) {
  // We're creating a new magical canvas to draw our chart on
  const chart = new ChartJsImage();
  
  // We're telling our magical paintbrush what kind of chart we want and what it should look like
  chart.setConfig({
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)'  // This is the color of our bars
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  // We're asking our magical paintbrush to draw the chart and give us a picture
  const image = await chart.toDataUrl();
  
  // We're returning the picture of our beautiful chart!
  return image;
}

/**
 * This is our magic function that can draw a colorful pie chart
 * @param {string} title - This is the name we want to give our chart
 * @param {string[]} labels - These are the names for each slice of our pie
 * @param {number[]} data - These are the sizes for each slice of our pie
 * @return {Promise<string>} - This is the magic spell (Promise) that will give us a picture of our chart
 */
async function createPieChart(title, labels, data) {
  // We're creating a new magical canvas to draw our chart on
  const chart = new ChartJsImage();
  
  // We're telling our magical paintbrush what kind of chart we want and what it should look like
  chart.setConfig({
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [  // These are the colors for our pie slices
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ]
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  });
  
  // We're asking our magical paintbrush to draw the chart and give us a picture
  const image = await chart.toDataUrl();
  
  // We're returning the picture of our beautiful chart!
  return image;
}

/**
 * This is our magic function that can draw a flowing line chart
 * @param {string} title - This is the name we want to give our chart
 * @param {string[]} labels - These are the points along our line
 * @param {number[]} data - These are the heights of each point on our line
 * @return {Promise<string>} - This is the magic spell (Promise) that will give us a picture of our chart
 */
async function createLineChart(title, labels, data) {
  // We're creating a new magical canvas to draw our chart on
  const chart = new ChartJsImage();
  
  // We're telling our magical paintbrush what kind of chart we want and what it should look like
  chart.setConfig({
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  // We're asking our magical paintbrush to draw the chart and give us a picture
  const image = await chart.toDataUrl();
  
  // We're returning the picture of our beautiful chart!
  return image;
}

// We're making our chart drawing functions available for other parts of our program to use
module.exports = {
  createBarChart,
  createPieChart,
  createLineChart
};