// import { addDoc, collection,  doc, updateDoc, setDoc , FieldValue, documentId} from "firebase/firestore";
// import { db} from "./database"; // removed from git repo for security 
import { getCurrentUser } from "./SignIn";

let attempts = 0;
let clears = 0;
let subject = null;
let DEBUG = true;

