//Const URL  variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

let data = d3.json(url).then(function(data) {
    console.log(data);
});

function init () {
    //Building Dropdown menu
    let ddmenu = d3.select("#selDataset");
        d3.json(url).then(function(data) {

        let select_names = data.names;
             select_names.forEach((name) => {
                       ddmenu.append("option")
            .text(name)
            .property("value", name);
        });

            //First sample 
            let firstSample = select_names[0]
            //console.log(firstSample)

           
            buildBarChart(firstSample);
            buildBubblePlot(firstSample);
            buildMetadata(firstSample);
            buildGaugeChart(firstSample);
    });

};

init()

//Create metadata panel
function buildMetadata (sampleID) {
   
    d3.json(url).then(function(data) {
        let metadata = data.metadata;

        let sampleArray = metadata.filter(sample => sample.id == sampleID);
       
        let sample = sampleArray[0];

        
        let panel = d3.select("#sample-metadata");
        panel.html("");
        
        for (key in sample) {
            panel.append("h6").text(key.toUpperCase()+": "+sample[key])
        }
    })
}

//Create bar chart
function buildBarChart(sample1) {
    d3.json(url).then(function(data) {
        
   
    let samples = data.samples;
    let s_Array = samples.filter(sample => sample.id == sample1);
    let result_s= s_Array[0];
    
    
    let otu_ids = result_s.otu_ids
    let sample_values = result_s.sample_values
    let otu_labels = result_s.otu_labels
    
    
    let trace1 = [
        {x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otu_id => "OTU "+otu_id).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h" }
    ];
   
    let barlayout = {
        title:" Top 10 OTU's found"
    };

    
    Plotly.newPlot("bar", trace1, barlayout)

    });

};

//Create bubble plot
function buildBubblePlot (sampleID) {
    d3.json(url).then(function(data) {
        let samples = data.samples;

    
    let sampleArray = samples.filter(sample => sample.id == sampleID);
    let sample = sampleArray[0];
    
   
    let otu_ids = sample.otu_ids
    let sample_values = sample.sample_values
    let otu_labels = sample.otu_labels
    
    
    let trace2 = [
        {x: otu_ids,
         y: sample_values,
         text: otu_labels,
         mode:"markers",
         marker:{
            size: sample_values, 
            color: otu_ids,
            colorscale: "Earth"
         }
         
        }];

   
    let layout = {
        xaxis: {title:"OTU ID"}
    };
    
    Plotly.newPlot("bubble", trace2, layout)

    });
};

//Function to populate the Gauge Chart
function buildGaugeChart(sample) {
    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
      
      
      let metadata = data.metadata;
      
     
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      
     
      let result = resultArray[0];
      
     
      let wfreq = result.wfreq;
      
      // Trace for the gauge chart
      let trace = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: "Belly Button Washing Frequency" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            bar: { color: "lightgreen" },
            steps: [
              { range: [0, 1], color: "#9033FF" },
              { range: [1, 2], color: "#BB33FF" },
              { range: [2, 3], color: "#D433FF" },
              { range: [3, 4], color: "#F933FF" },
              { range: [4, 5], color: "#FF33E3" },
              { range: [5, 6], color: "#FF33A2" },
              { range: [6, 7], color: "#FF336B" },
              { range: [7, 8], color: "#FF334F" },
              { range: [8, 9], color: "#FF3336" }
            ],
          }
        }
      ];
      
      // Layout
      let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
      
      // Plotly to plot the gauge chart
      Plotly.newPlot("gauge", trace, layout);
    });
  }

//Update change
function optionChanged(sampleID) {
    buildMetadata(sampleID);
    buildBarChart(sampleID);
    buildBubblePlot(sampleID);
    buildGaugeChart(sampleID);
};


