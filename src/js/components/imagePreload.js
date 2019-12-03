export default class ImagePreload {
  constructor() {
    this.newimages = [];
    this.loadedimages = 0;
    this.postaction = function () {};
  }

  load(images) {
    let self = this;
    this.images = (typeof images != "object") ? [images] : images;

    for (var i=0; i<this.images.length; i++){
      this.newimages[i] = new Image();
      this.newimages[i].src = this.images[i];
      this.newimages[i].onload = function(){
        self.imageloadpost();
      }
      this.newimages[i].onerror = function(){
        self.imageloadpost();
      }
    }

    return {
			done:function(f){
				self.postaction = f || self.postaction
			}
  	}
  }

  imageloadpost() {
    this.loadedimages++
    if (this.loadedimages == this.images.length){
      this.postaction(this.newimages)
    }
  }
}
