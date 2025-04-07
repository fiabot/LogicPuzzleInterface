import { useState } from "react"
import "./AuthoringStyle.css"
export default Collabseable = ({content, title, showByDefault = true}) => {
    let [show, setShow] = useState(showByDefault)


    return <div>
            <button className="collapseButton" onClick={() => setShow(!show)}>{title} {show? "⌄" : ">"}</button>
            {show? content: ""}

    </div>
}