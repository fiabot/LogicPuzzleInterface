export default class Category{
    constructor(name, entities, is_numeric){
        this.entities = entities;
        this.name = name; 
        this.length = entities.length;
        this.is_numeric = is_numeric;
    }
}