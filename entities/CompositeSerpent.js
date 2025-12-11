class CompositeSerpent {
  constructor(x, y, segmentCount) {
    this.head = new SerpentHead(x, y);
    for(let i=0;i<segmentCount;i++){
      let s = new SerpentSegment(x-i*20, y);
      this.head.addSegment(s);
    }
  }

  update() {
    this.head.update();
  }

  show() {
    this.head.show();
  }
}
