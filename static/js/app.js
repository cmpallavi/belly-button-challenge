let data = '';



function init() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((response) => 
    {
        console.log(response);
        data = response;
        
        let dropdown = d3.select('#selDataset')
        console.log(data);
        // Add  samples to dropdown menu
        data.names.forEach((name) => {

            dropdown.append("option")
            .text(name)
            .property("value", name);
        });

        testName = data.names[0];
        buildDemographic(data, testName);
        buildBarChart(data, testName);
        buildBubbleChart(data, testName);
    });
}


function optionChanged(value) {
    console.log(value);
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((response) => 
    {
        buildDemographic(response, value);
        buildBarChart(response, value);
        buildBubbleChart(response, value);
    });
}

function buildDemographic(data, name) {
    name_metadata = data.metadata.filter((n) => {return n.id == name});
    console.log(name_metadata);
    
    metadata = d3.select('#sample-metadata').html("");

    Object.entries(name_metadata[0]).forEach(([key,value]) => {
        console.log('key:' + key + ', value:' + value) ;
        metadata.append("h5").text(`${key}: ${value}`);
    });
}

function buildBarChart(data, name) {
    name_samples = data.samples.filter((n) => {return n.id == name});
    console.log(name_samples);
    let otu_ids = name_samples[0].otu_ids;
    let otu_labels = name_samples[0].otu_labels;
    let sample_values = name_samples[0].sample_values;

    let trace = {
        // Slice the top 10 otus
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
    };
    let layout = {
        title: "Top 10 OTUs Present"
    };
    data = [trace];
    // Use Plotly to plot the data in a bar chart
    Plotly.newPlot("bar", data);

}

function buildBubbleChart(data, name) {
    name_samples = data.samples.filter((n) => {return n.id == name});
    console.log(name_samples);
    let otu_ids = name_samples[0].otu_ids;
    let otu_labels = name_samples[0].otu_labels;
    let sample_values = name_samples[0].sample_values;

    let trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    };
    let d = [trace];
    let layout= {
        title: "Bacteria Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", d, layout)
}

init();