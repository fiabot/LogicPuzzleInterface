
const states = ["*", "O", "X", "!", "?"]

let toggleState = (s, setState, select) => {
    if (s == select) {
        setState("*")
    } else {
        setState(select)
    }


    // addUserAction(pid, "mark", {cell, mark}, time)
}

export default Cell = ({ state, setState, mousedown = false, topText = "", leftText = "", select = "*" }) => {

    let className = "";
    let text = "";
    let locked = false;

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
    else if (state == "x") {
        className = "linkedLocked"
        text = "X"
        locked = true
    } else if (state == "o") {
        className = "notLinkedLocked"
        text = "O"
        locked = true
    }


    return (<div className="cell" onMouseDown={() => { toggleState(state, setState, select) }} onMouseEnter={locked? () => {} : () => { if (mousedown) { toggleState(state, setState, select) } }}>

        <span className={className}> {text}</span>

    </div>);

}