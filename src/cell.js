
const states = ["*", "O", "X", "!", "?"]

let toggleState = (puzzle, setPuzzle, select, subGridRow, subGridCol, row, col) => {
    updatedPuzzle = JSON.parse(JSON.stringify(puzzle));
    s = puzzle[subGridRow][subGridCol][row][col]
    if (s == select) {
        updatedPuzzle[subGridRow][subGridCol][row][col] = "*"
    } else {
        updatedPuzzle[subGridRow][subGridCol][row][col] = select
    }

    setPuzzle(updatedPuzzle)
    // addUserAction(pid, "mark", {cell, mark}, time)
}

export default Cell = ({ puzzleName, puzzle, setPuzzle, subGridRow, subGridCol, row, col, mousedown = false, topText = "", leftText = "", select = "*" }) => {

    let className = "";
    let text = ""

    state = puzzle[subGridRow][subGridCol][row][col]

    if (state == "X") {
        className = "notlinked"
        text = "X"
    } else if (state == "O") {
        className = "linked"
        text = "O"
    }
    else if (state == "!") {
        className = "linkedUnsure"
        text = "O"
    } else if (state == "?") {
        className = "notlinkedUnsure"
        text = "X"
    }

    return (<div className="cell" onMouseDown={() => { toggleState(puzzle, setPuzzle, select, subGridRow, subGridCol, row, col) }} onMouseEnter={() => { if (mousedown) { toggleState(puzzle, setPuzzle, select, subGridRow, subGridCol, row, col) } }}>

        <span className={className}> {text}</span>

    </div>);

}