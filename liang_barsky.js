var px;            
var py;            
var pw;            
var ph;            
var points = [];   

var menuGroup = [];        
var menuTextGroup = [];    
var dataTextGroup = [];    

function setup() {
  createCanvas(220, 220);  
  
  menuGroup[0] = createInput();  
  menuGroup[1] = createInput();
  menuGroup[2] = createInput();
  menuGroup[3] = createInput();
  
  menuTextGroup[0] = createElement('h6', 'x0');        
  menuTextGroup[1] = createElement('h6', 'y0');
  menuTextGroup[2] = createElement('h6', 'width');
  menuTextGroup[3] = createElement('h6', 'height');
  
  dataTextGroup[0] = createElement('h6', 'P0 x = ');   
  dataTextGroup[1] = createElement('h6', 'P0 y = ');
  dataTextGroup[2] = createElement('h6', 'P1 x = ');
  dataTextGroup[3] = createElement('h6', 'P1 y = ');
  dataTextGroup[4] = createElement('h6', 'M  x = ');
  dataTextGroup[5] = createElement('h6', 'M  y = ');
  
  for (let i = 0; i < 4; i++) {           
    let menuh = map(i, 0, 6, 10, 200);
    menuGroup[i].position(width + 10, menuh);
    menuGroup[i].style('width', '80px');
    menuTextGroup[i].position(width + 100, menuh - 20);
  }
  
  for (let i = 0; i < 6; i++) {           
    let menuh = map(i, 0, 6, 10, 200);
    dataTextGroup[i].position(width + 150, menuh - 20);
  }
 
  butrandom = createButton('randomise');  
  butrandom.position(width + 10, 135);
  butrandom.mousePressed(randomise);
  butrestart = createButton('restart');   
  butrestart.position(width + 10, 165);
  butrestart.mousePressed(restart);
  
  randomise();  
  restart();
}


function draw() {
  background(200); 
  stroke(80, 80, 200);                       
  var rect = new Rectangle(px, py, pw, ph);  
  rect.Display();                            
  
  var phover = new Point(mouseX, mouseY);      
  points.push(phover);                         
  for (let i = 0; i < points.length - 2; i+=2) 
  {
    let s = new Segment(points[i], points[i+1]);  
    stroke(200, 80, 80);  
    s.Display();          
    points[i].Display();
    points[i+1].Display();
    rect.LiangBarsky(s);  
  }
  stroke(80, 80, 200);         
  if (points.length % 2 == 0)  
  {                            
    let s = new Segment(points[points.length-2], points[points.length-1]);
    s.Display();
    points[points.length-2].Display();  
  }
  
  points[points.length-1].Display();
  dataTextGroup[4].html('M  x = ' + points[points.length-1].X);   
  dataTextGroup[5].html('M  y = ' + points[points.length-1].Y);
    
  points.pop();  
}

function mousePressed()   
{
  if (mouseX < width && mouseY < height)        
    { points.push(new Point(mouseX, mouseY)); } 
}                                               

function restart()  
{                   
  if (parseInt(menuGroup[0].value(), 10) < 10)  
  { menuGroup[0].value(10); }                   
  else if (parseInt(menuGroup[0].value(), 10) > 200)
  { menuGroup[0].value(200); } 
  if (parseInt(menuGroup[1].value(), 10) < 10)
  { menuGroup[1].value(10); }
  else if (parseInt(menuGroup[1].value(), 10) > 200)
  { menuGroup[1].value(200); } 
  px = parseInt(menuGroup[0].value(), 10);
  py = parseInt(menuGroup[1].value(), 10);
  if (parseInt(menuGroup[2].value(), 10) < 1)
  { menuGroup[2].value(1); } 
  else if (parseInt(menuGroup[2].value(), 10) > 210 - px)
  { menuGroup[2].value(210 - px); } 
  if (parseInt(menuGroup[3].value(), 10) < 1)
  { menuGroup[3].value(1); }
  else if (parseInt(menuGroup[3].value(), 10) > 210 - py)
  { menuGroup[3].value(210 - py); } 
  pw = parseInt(menuGroup[2].value(), 10);
  ph = parseInt(menuGroup[3].value(), 10);
  points = [];  
}

function randomise()  
{                   
  menuGroup[0].value(parseInt(random(10, 210), 10));
  menuGroup[1].value(parseInt(random(10, 210), 10));
  menuGroup[2].value(parseInt(random(209 - menuGroup[0].value())+1, 10));
  menuGroup[3].value(parseInt(random(209 - menuGroup[1].value())+1, 10));
}

class Point        
{
  constructor(x, y)  
  {            
    this.X = x;      
    this.Y = y;     
  }
  Display()   
  {
    push();
    strokeWeight(3);          
    point(this.X, this.Y);  
    pop();
  }
}

class Segment          
{
  constructor(S, F)   
  {
    this.Start = S;    
    this.Finish = F;   
  }
  Display()          
  {
    push();
    strokeWeight(1);     
    line(this.Start.X, this.Start.Y, this.Finish.X, this.Finish.Y);
    pop();
  }
}

class Rectangle            
{
  constructor(x, y, w, h)  
  {
    let p1 = new Point(x, y);
    let p2 = new Point(x, y + h); 
    let p3 = new Point(x + w, y + h);
    let p4 = new Point(x + w, y);
    this.Segments = [new Segment(p1, p2),
                     new Segment(p2, p3),
                     new Segment(p3, p4),
                     new Segment(p4, p1)];  
  }
  Display()          
  {
    for(let s of this.Segments)
    {
      s.Display();  
    }
  }
  LiangBarsky(S)    
  {
    let p = [S.Start.X - S.Finish.X,                
             -S.Start.X + S.Finish.X,
             S.Start.Y - S.Finish.Y,
             -S.Start.Y + S.Finish.Y];
    let q = [S.Start.X - this.Segments[0].Start.X,  
             this.Segments[2].Start.X - S.Start.X,
             S.Start.Y - this.Segments[0].Start.Y,
             this.Segments[2].Start.Y - S.Start.Y];
    let tmax = [0];         
    let tmin = [1];
    for(let i = 0; i < 4; i++)  
    {
      if (p[i] < 0) 
      {
        tmax.push(q[i]/p[i]);  
      }
      else
      {
        tmin.push(q[i]/p[i]);
      }
    }
    let t0 = max(tmax);
    let t1 = min(tmin);
    
      print(p);    
      print(q);
      print(t0);
      print(t1);  
      
    if (t0 <= t1)  
    {              
      let P0 = new Point(S.Start.X + p[1] * t0, S.Start.Y + p[3] * t0);
      let P1 = new Point(S.Start.X + p[1] * t1, S.Start.Y + p[3] * t1);
      let Sout0 = new Segment(S.Start, P0);  
      let Sin = new Segment(P0, P1);         
      let Sout1 = new Segment(P1, S.Finish);
    
      stroke(200, 80, 80);  
      Sout0.Display();
      Sout1.Display();
      stroke(80, 200, 80);  
      Sin.Display();        
      P0.Display();
      P1.Display();
      
      dataTextGroup[0].html('P0 x = ' + parseInt(P0.X, 10));   
      dataTextGroup[1].html('P0 y = ' + parseInt(P0.Y, 10));   
      dataTextGroup[2].html('P1 x = ' + parseInt(P1.X, 10));  
      dataTextGroup[3].html('P1 y = ' + parseInt(P1.Y, 10));
   
      print(P0);  
      print(P1);
    }
  }
}
