import { useEffect, useState } from "react";

let pyodideInstance = null;
let pyodideLoadingPromise = null;
let pyodideScript = null;

// importScripts("https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js")

async function getPyodide() {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (pyodideLoadingPromise) {
    return pyodideLoadingPromise;
  }

  pyodideLoadingPromise = loadPyodide().then(async (pyodide) => {
    // await pyodide.loadPackage(["numpy", "matplotlib"]);
    console.log("got pyodide from window")
    pyodideInstance = pyodide;
    return pyodide;
  });

  return pyodideLoadingPromise;
}

// interface UsePyodideResult {
//   pyodide: PyodideInterface | null;
//   loading: boolean;
//   error: string | null;
// }

export function usePyodide() {
  const [pyodide, setPyodide] = useState(
    pyodideInstance,
  );
  const [loadingScript, setLoadingScript] = useState(!pyodideScript)
  const [loading, setLoading] = useState(!pyodideInstance);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pyodideScript) {
      return;
    }
    setLoadingScript(true)
    console.log("adding script...")
    pyodideScript = document.createElement('script');
    pyodideScript.src = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js";
    pyodideScript.addEventListener('load', () =>{
      console.log("pyodide script loaded")     
      setLoadingScript(false)
    })
    document.body.appendChild(pyodideScript);
  }, [])
  useEffect(() => {
    if (pyodideInstance) {
      return;
    }
    if (loadingScript) {
      return;
    }


    let cancelled = false;

    getPyodide()
      .then((instance) => {
        if (!cancelled) {
          setPyodide(instance);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.log("failed to load pyodide")
          setError(err.message || "Failed to load Pyodide");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loadingScript]);

  return { pyodide, loading, error };
}