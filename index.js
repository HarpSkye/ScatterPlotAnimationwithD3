const dataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

//set variables
const h = 500;
const w = 500;
const p = 50;

const data = d3.json(dataURL).then(d => {
    const data = d;

    let time = [];
    var parseTime = d3.timeParse("%M:%S")
    for (let i of data){
        time.push(parseTime(i['Time']))
    }
    
    let year = [];
    //var parseYear = d3.timeParse('%Y')
    for (let i of data){
        year.push(i['Year'])
    }
    
    //set scale range
    const xScale = d3.scaleLinear().domain([d3.min(year)-1, d3.max(year)+2]).range([0, w-p]);
    const yScale = d3.scaleTime().domain([d3.min(time), d3.max(time)]).range([p, h-p]);
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(10);
    var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S')).ticks(20);

    //set canvas
    const svg = d3.select('#svg')
                .append('svg')
                .attr('width', w)
                .attr('height', h)

    //scatter plot
const scatter = svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d=>{return xScale(0)})
        .attr('cy', d=>{return yScale(0)})
        .attr('r', 5)
        .attr('class', 'dot')
        .attr('transform', `translate(${p},0)`)
        .style('stroke', 'black')
        .style('opacity', 0.8)
        .style('fill', (d)=>{if(d['Doping']===''){return "green"} 
                                        else{return "yellow"}})
    //scatter plot animation
    scatter.transition()
            .delay((d,i) => {return i*30})
            .duration((d,i) => {return 800 + i*2}) 
            .attr('cx', d=>{return xScale(d['Year'])})
            .attr('cy', d=>{return yScale(parseTime(d['Time']))})
            .attr('r', 5)
        
    //set tooltip
    const tooltip = d3.select('body').append('div')
        .attr('id', 'tooltip')
        // .style('width', auto)
        // .style('height', auto)
        .style('position', 'absolute')
        .style('opacity', 0)
        .style('border', 'solid')
        .style('border-width', '0px')
        .style('border-radius', '15px')
        .style('padding', '10px')
        .style('background-color', 'lightgray')

    //set mouseover for tooltip
    scatter.on('mouseover', function(event, d){d3.select(this);
                                                tooltip
                                                    .html(`${d['Name']}`+': '+`${d['Nationality']}` + '<br />' 
                                                            +"Year: " + `${d['Year']}`+ " Time: " + `${d['Time']}` +'<br />' + '<br />'
                                                            +`${d['Doping']}`) 
                                                    .attr('transform', `translate(${p},0)`)
                                                    .style('left', xScale(d['Year']) + 600 + 'px')
                                                    .style('top', yScale(parseTime(d['Time'])) + 'px')
                                                    .style('opacity', 1)
                                                    .attr('data-year', (item) => {return item['Year']});
                                                })
            .on('mouseout', function(){d3.select(this);
                                                tooltip.style('opacity', 1);
        
        })
         

    //append axis in canvas
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${p},${w-p})`)
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${p}, 0)`)
        .call(yAxis)

    //y-axis label
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('class', 'y-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -70)
        .attr('y', 10)
        .style('font-size', 15)
        .text('Time in Minutes')

    //x-axis label
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('class', 'x-label')
        .attr('x', `${w}`)
        .attr('y', `${h}`-15)
        .style('font-size', 15)
        .text('Year')

    //svg label
    svg.append('text')
        .attr('x', w/2)
        .attr('y', p-30)
        .attr('text-anchor', 'middle')
        .style('font-size', '24px')
        .style('text-decoration', 'underline')
        .attr('id', 'subtitle')
        .text("35 Fastest times up Alpe d'Huez")

    //svg legend
    svg.append('rect').attr('x', w -120).attr('y', h/2).attr('width', 10).attr('height', 10).style('fill', "green").style('stroke', 'black')
    svg.append('rect').attr('x', w -120).attr('y', h/2+15).attr('width', 10).attr('height', 10).style('fill',"yellow").style('stroke', 'black')
    svg.append('text').attr('x', w -105).attr('y', h/2+10).attr('width', 10).attr('height', 10).text('No doping').style('font-size', 15 + 'px')
    svg.append('text').attr('x', w -105).attr('y', h/2+25).attr('width', 10).attr('height', 10).text('With Doping').style('font-size', 15 + 'px')
})
