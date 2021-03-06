
/**
 * @todo: document
 */
__extend__(Document.prototype,{
    load: function(url){
        if(this.documentURI == 'about:html'){
            this.location.assign(url);
        }else if(this.documentURI == url){
            this.location.reload(false);
        }else{
            this.location.replace(url);
        }
    },
    get location(){
        return new Location(this.documentURI, this);
    },
    set location(url){
        //very important or you will go into an infinite
        //loop when creating a xml document
        if(url)
            this.location.replace(url);
    }
});
