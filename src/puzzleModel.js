export default class PuzzleModel {
    constructor(categories, hints, hint_grammar, solutionString, num){
        this.categories = categories; 
        this.numEnt = categories[0].entities.length 
        this.solutionString = solutionString
        this.num = num

        this.leftRight = []
        for(let i = 0; i < this.categories.length - 1; i ++){
            this.leftRight.push(categories[i])
        }

        this.topBottom = []
        this.hints = hints 
        this.hint_grammar = hint_grammar

        for(let i = this.categories.length - 1; i > 0; i --){
            this.topBottom.push(categories[i])
        }

    }
}