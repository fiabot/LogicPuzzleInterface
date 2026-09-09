
const states = ["*", "O", "X", "!", "?"]

let toggleState = (s, setState, select) => {
    if (s == select) {
        setState("*")
    } else {
        setState(select)
    }


    // addUserAction(pid, "mark", {cell, mark}, time)
}

export default Cell = ({ puzzleName, coords, state, setState, mousedown = false, topText = "", leftText = "", select = "*" }) => {

    let className = "";
    let text = ""

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

    return (<div className="cell" onMouseDown={() => { toggleState(state, setState, select); console.log(`mouse click ${select} detected in ${puzzleName} cell ${coords}`) }} onMouseEnter={() => { if (mousedown) { setState(select); console.log(`mouse enter click ${select} detected in ${puzzleName} cell ${coords}`) } }}>

        <span className={className}> {text}</span>

    </div>);

}