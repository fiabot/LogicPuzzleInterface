import { ADD_SUBJECT, ADD_TUTORIAL, ADD_GAME_PLAY_INSTANCE, ADD_SURVEY, ADD_EVENT, api } from './config'

let DEBUG = true

export const addSubject = async (userId, logicPuzzleExp, gridPuzzleExp, levelMode, studyMode) => {
    console.log(`Log add subject ${user}`)
    if (DEBUG) {
        return
    }

    response = await api.post(ADD_SUBJECT, {
        userId: userId,
        logicPuzzleExp: logicPuzzleExp,
        gridPuzzleExp: gridPuzzleExp,
        levelMode: levelMode,
        studyMode: studyMode,
    })

    console.log(`Response: ${response}`)

    return response
}


export const setTutorialInfo = async (time, slide) => {
    console.log(`Log tutorial info: ${time}, ${slide}`)
    if (DEBUG) {
        return
    }

    response = await api.post(ADD_TUTORIAL, {
        userId: user,
        tutorialTime: time,
        tutorialSlide: slide,
    })
    console.log(`Response: ${response}`)
    return response
}

export const createGamePlayInstance = async (pid) => {
    console.log(`Log create game play instance for puzzle ${pid}`)
    if (DEBUG) {
        return
    }
    response = await api.post(ADD_GAME_PLAY_INSTANCE, {
        userId: user,
        pid: pid,
        conceded: true,
        numAttempts: 1,
        numClears: 0,
        totalTime: 0,
        numIncorrect: 0,
        numCorrect: 0,
    });
    console.log(`Response: ${response}`)
    return response
}

export const addSurvey = async (puzzleSurveyData) => {
    console.log("Log survey")
    if (DEBUG) {
        return
    }

    response = await api.post(ADD_SURVEY, {
        ...puzzleSurveyData,
        userId: user,
        pid: pid,
    });
    console.log(`Response: ${response}`)
    return response
}

export const addCellChange = async (instanceId, time, puzzleState, correct, incorrect, solved) => {
    console.log(`Log cell change to ${instanceId}`)
    if (DEBUG) {
        return
    }
    response = await api.post(ADD_EVENT, {
        userId: user, 
        time: time, 
        type: "cellChange", 
        puzzleState: puzzleState, 
        correct: correct, 
        incorrect: incorrect, 
        solved: solved,
    })
    console.log(`Response: ${response}`)
    return response
}

export const addStrugglingToggle = async (instanceId, time, struggling) => {
    console.log(`Log struggling change to ${instanceId}`)
    if (DEBUG) {
        return
    }
    response = await api.post(ADD_EVENT, {
        instanceId: instanceId, 
        time: time, 
        type: "strugglingToggle", 
        struggling: struggling,
    })
    console.log(`Response: ${response}`)
    return response
}

export const addHintToggle = async (instanceId, time, hint, striked) => {
    console.log(`Log hint toggle for ${instanceId}`)
    if (DEBUG) {
        return
    }
    response = await api.post(ADD_EVENT, {
        instanceId: instanceId, 
        time: time, 
        type: "hintToggle", 
        hint: hint, 
        striked: striked,
    })
    console.log(`Response: ${response}`)
    return response
}

export const addButtonPress = async (instanceId, time, button) => {
    console.log(`Log button press ${button} for ${instanceId}`)
    if (DEBUG) {
        return
    }
    response = await api.post(ADD_EVENT, {
        instanceId: instanceId, 
        time: time, 
        type: "buttonClick", 
        button: button,
    })
    console.log(`Response: ${response}`)
    return response
}
