import Category from "./categoryModel";
defaultText = "Play a logic puzzle!"
defaultName = "Untitled"
class PuzzleModel {
    constructor(categories, hints, solutionString, num, scenarioText, title, narratives){
        this.title = title
        this.categories = categories; 
        this.numEnt = categories[0].entities.length 
        this.solutionString = solutionString
        this.num = num
        this.scenarioText  = scenarioText
        this.narratives = narratives

        this.leftRight = []
        for(let i = 0; i < this.categories.length - 1; i ++){
            this.leftRight.push(categories[i])
        }

        this.topBottom = []
        this.hints = hints 

        for(let i = this.categories.length - 1; i > 0; i --){
            this.topBottom.push(categories[i])
        }

    }
}

function createPuzzle(data) {
    let categories = []
    for (cat in data.categories) {
        cat = data.categories[cat]
        categories.push(new Category(cat.name, cat.entities))
    }

    text = "scenario" in data ? data["scenario"] : defaultText
    title = "name" in data ? data["name"] : defaultName
    narratives = "narratives" in data? data["narratives"] : []
  
    return new PuzzleModel(categories, data.hints, data.solution, data.id, text, title, narratives)
  
  }


  export{PuzzleModel,createPuzzle}