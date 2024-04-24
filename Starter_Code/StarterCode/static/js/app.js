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

//Update change
function optionChanged(sampleID) {
    buildMetadata(sampleID);
    buildBarChart(sampleID);
    buildBubblePlot(sampleID);
};