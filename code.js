figma.showUI(__html__,  { width: 300, height: 580, title: "Random Linechart" });

figma.loadFontAsync({ family: "Inter", style: "Regular" });

figma.ui.onmessage = msg => {
  
  if (msg.type === 'create-linechart') {
    
    const nodes = [];
    
    let y = 0;
    let x = 0;
    const circleSize = msg.dotsSize;
    let randomDomain = msg.height;
    const identifier = Math.floor(Math.random()*1000);

    let leftLabelsMargin = 0;
    let bottomLabelsMargin = 0;
    if ((msg.grid === "yes") && (msg.labels === "yes")){
        leftLabelsMargin = 50;
        bottomLabelsMargin = 30;
    }   
    

    const labels_color = {r:106/255, g:113/255, b:125/255};

    const colors = [{r:96, g:146, b:192},
        {r:84, g:179, b:153},
        {r:211, g: 96, b:134},
        {r:145, g: 112, b: 184},
        {r:202, g: 142, b: 174},
        {r:214, g: 191, b: 87},
        {r:185, g: 168, b: 136},
        {r:218, g: 139, b: 69},];

    // ---------------------------------
    // Create chart frame
    const chart_frame = figma.createFrame();
    chart_frame.resizeWithoutConstraints(msg.width, msg.height);
    chart_frame.clipsContent = false;
    chart_frame.fills = [];
    chart_frame.name = "linechart-frame-"+identifier;

    // ---------------------------------
    // Define random domain according to variability
    let offset = 0;
    if (msg.variability === "high"){
        randomDomain = msg.height-bottomLabelsMargin;
        offset = 0;
    }        
    else if (msg.variability === "medium") {
        randomDomain = (msg.height-bottomLabelsMargin)/2;
        offset = ((msg.height-bottomLabelsMargin)/4);
    }
    else if (msg.variability === "low") {
        randomDomain = (msg.height-bottomLabelsMargin)/3;
        offset = ((msg.height-bottomLabelsMargin)/3);
    }

    // ---------------------------------
        // Drag grid if required

        const grid_strokes = [{ type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}];
        const today = new Date();                
        if (msg.grid == "yes")
        {
            for (var i=0; i<msg.pointsCount; i++){
            const grid_vertical_line = figma.createVector();
            grid_vertical_line.name = "grid_vertical_line_"+identifier;
            grid_vertical_line.vectorPaths = [{
                windingRule: "NONE",
                data: "M "+ (leftLabelsMargin+(i*((msg.width-leftLabelsMargin)/(msg.pointsCount-1)))) +" 0 L "+ (leftLabelsMargin+(i*((msg.width-leftLabelsMargin)/(msg.pointsCount-1)))) +" " + (msg.height-bottomLabelsMargin),
            }]    
        
            grid_vertical_line.strokes = grid_strokes;
            chart_frame.appendChild(grid_vertical_line);
            nodes.push(grid_vertical_line)

            if (msg.labels == "yes"){

                today.setDate(today.getDate()+1);

                const bottom_label = figma.createText();
                bottom_label.fontName = { family: "Inter", style: "Regular" };
                bottom_label.characters = today.getMonth()+"/"+today.getDate();
                bottom_label.textAlignHorizontal = "CENTER";
                bottom_label.resize(40,16);
                bottom_label.fontSize = 10;
                bottom_label.setRangeFills(0,bottom_label.characters.length, [{ type: 'SOLID', color: labels_color}]);
                bottom_label.x = (leftLabelsMargin+(i*((msg.width-leftLabelsMargin)/(msg.pointsCount-1))))-20;
                bottom_label.y = (msg.height-bottomLabelsMargin+5);
                bottom_label.name = "bottom_label_"+identifier;
            }
        }
        for (var i=0; i<5; i++){
            const grid_horizontal_line = figma.createVector();
            grid_horizontal_line.name = "grid_horizontal_line_"+identifier;
            grid_horizontal_line.vectorPaths = [{
                windingRule: "NONE",
                data: "M " + leftLabelsMargin + " "+ (((msg.height-bottomLabelsMargin)/4*i)) + " L "+ msg.width +" "+(((msg.height-bottomLabelsMargin)/4*i)),
            }]    
            
            grid_horizontal_line.strokes = grid_strokes;
            chart_frame.appendChild(grid_horizontal_line);
            nodes.push(grid_horizontal_line)

            if (msg.labels == "yes"){
                const left_label = figma.createText();
                left_label.fontName = { family: "Inter", style: "Regular" };
                left_label.characters = ((4-i)*100)+"K";
                left_label.textAlignHorizontal = "RIGHT";
                left_label.resize(30,16);
                left_label.fontSize = 10;
                left_label.setRangeFills(0,left_label.characters.length, [{ type: 'SOLID', color: labels_color}]);
                left_label.x = 10;
                left_label.y = (((msg.height-bottomLabelsMargin)/4*i))-8;
                left_label.name = "left_label_"+identifier;


            }
        }  
        
            const vertical_grid = figma.currentPage.findAll(n => n.name === "grid_vertical_line_"+identifier);
            const horizontal_grid = figma.currentPage.findAll(n => n.name === "grid_horizontal_line_"+identifier);
            const vertical_grid_group = figma.group(vertical_grid, chart_frame);
            vertical_grid_group.name = "Vertical Grid Lines";
            const horizontal_grid_group = figma.group(horizontal_grid, chart_frame);
            horizontal_grid_group.name = "Horizontal Grid Lines";

            if (msg.labels == "yes"){
                const left_labels = figma.currentPage.findAll(n => n.name === "left_label_"+identifier);
                const bottom_labels = figma.currentPage.findAll(n => n.name === "bottom_label_"+identifier);
                const left_labels_group = figma.group(left_labels, chart_frame);
                left_labels_group.name = "Left Labels";
                const bottom_labels_group = figma.group(bottom_labels, chart_frame);
                bottom_labels_group.name = "Bottom Labels";
            }

        
        }

    
    
    for (let k=0; k<msg.lines; k++){

        const color = {r:colors[k].r/255, g:colors[k].g/255, b:colors[k].b/255};
        const path = figma.createVector();
        path.name = "Line_"+k;
        path.strokeCap = "ROUND";
        path.strokeJoin = "ROUND";
        let d = "";

        // ---------------------------------
        // Randomize path points
        let points = [];
        for (var i=0; i<msg.pointsCount; i++)
        {
            y = (Math.floor(Math.random()*randomDomain)+offset)
            x = leftLabelsMargin + (i*((msg.width-leftLabelsMargin)/(msg.pointsCount-1)));
            points.push({x : x, y : y});
        }

        const bezier_handler_x = (msg.width/(msg.pointsCount-1))/3;
        
        // ---------------------------------
        // Create path d attribute
        if (msg.line_style === 'edged'){
            for (var i=0; i<msg.pointsCount; i++)
            {
            if (i == 0)
                d = d + "M "+ leftLabelsMargin +" " + points[i].y;    
            else
                d = d + " L " + points[i].x + " " + points[i].y;
            }
        } else if (msg.line_style === 'curved'){
            for (var i=0; i<(msg.pointsCount-1); i++)
            {
            if (i == 0)
                d = d + "M "+ leftLabelsMargin +" " + points[i].y + " C " + (points[i].x+bezier_handler_x) + " " + points[i].y + " " + (points[i+1].x-bezier_handler_x) + " " + points[i+1].y + " " +points[i+1].x + " " + points[i+1].y;    
            else
                d = d + " C " + (points[i].x+bezier_handler_x) + " " + points[i].y + " " + (points[i+1].x-bezier_handler_x) + " " + points[i+1].y + " " +points[i+1].x + " " + points[i+1].y;
            }
        }
        
        path.vectorPaths = [{
            windingRule: "NONE",
            data: d,
        }]


        const strokes = clone(path.strokes)
        strokes[0] = { type: 'SOLID', color: color};
        path.strokes = strokes;
        path.strokeWeight = 2;



        chart_frame.appendChild(path);
        nodes.push(path)


        // ---------------------------------
        // Add circles to path vertex
        if (msg.dots === 'yes')
        {
            for (var i=0; i<msg.pointsCount; i++)
            {
                let circle = figma.createEllipse();
                circle.name = "line_dots_"+identifier+"_"+k;
                circle.x = points[i].x - circleSize/2;
                circle.y = points[i].y - circleSize/2; 
                circle.fills = [{type: 'SOLID', color: {r:1, g:1, b:1}}];

                circle.strokes = strokes;
                circle.strokeWeight = 2;
                circle.strokeAlign = 'OUTSIDE'

                circle.resize(circleSize, circleSize);
                chart_frame.appendChild(circle);
                nodes.push(circle)
            }

            // ---------------------------------
            // Group dots
            const dots = figma.currentPage.findAll(n => n.name === "line_dots_"+identifier+"_"+k);
            const dots_group = figma.group(dots, chart_frame);
            dots_group.name = "Dots";
        
            const linechart_group = figma.group([dots_group,path],chart_frame);
            linechart_group.name = "Linechart_"+k;
        }

}

    figma.currentPage.selection = [chart_frame];
    figma.viewport.scrollAndZoomIntoView([chart_frame]);
  }
  figma.closePlugin();
};

function clone(val) {
    return JSON.parse(JSON.stringify(val))
  }