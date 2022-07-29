class Cell{
    constructor(value){
        this.collapsed = false;

        //if an array is passed in, make the options that array
        if(value instanceof Array){
            this.options = value;
        } else{
            //otherwise, fill the array with all options
            this.options = [];
            for(let i = 0; i < value; i++){
                this.options[i] = i;
            }
        }
    }
};