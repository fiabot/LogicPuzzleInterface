import { ADD_SUBJECT, ADD_TUTORIAL, ADD_GAME_PLAY_INSTANCE, ADD_SURVEY, ADD_EVENT, api } from './config'

let DEBUG = true

export const addSubject = async (logicPuzzleExp, gridPuzzleExp, levelMode, studyMode) => {
    if (DEBUG) {
        return
    }

    response = await api.post(ADD_SUBJECT, {
        userId: user,
        logicPuzzleExp: logicPuzzleExp,
        gridPuzzleExp: gridPuzzleExp,
        levelMode: levelMode,
        studyMode: studyMode,
    })

    return response
}


export const setTutorialInfo = async (time, slide) => {
    if (DEBUG) {
        return
    }

    response = await api.post(ADD_TUTORIAL, {
        userId: user,
        tutorialTime: time,
        tutorialSlide: slide,
    })
    return response
}

export const createGamePlayInstance = async (pid) => {
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
    return response
}

export const addSurvey = async (pid, puzzleSurveyData) => {
    if (DEBUG) {
        return
    }

    response = await api.post(ADD_SURVEY, {
        ...puzzleSurveyData,
        userId: user,
        pid: pid,
    });
    return response
}

export const addCellChange = async (instanceId, time, puzzleState, correct, incorrect, solved) => {
    console.log(`log cell change to ${instanceId}`)
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
    return response
}

export const addStrugglingToggle = async (instanceId, time, struggling) => {
    console.log(`log struggling change to ${instanceId}`)
    if (DEBUG) {
        return
    }
    response = await api.post(ADD_EVENT, {
        instanceId: instanceId, 
        time: time, 
        type: "strugglingToggle", 
        struggling: struggling,
    })
    return response
}

export const addHintToggle = async (instanceId, time, hint, striked) => {
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
    return response
}

export const addButtonPress = async (instanceId, time, button) => {
    if (DEBUG) {
        return
    }
    response = await api.post(ADD_EVENT, {
        instanceId: instanceId, 
        time: time, 
        type: "buttonClick", 
        button: button,
    })
    return response
}
