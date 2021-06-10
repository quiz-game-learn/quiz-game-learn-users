import {State} from "../../models/State";
import {Quiz} from "../../models/Quiz";
import {Lesson} from "@/models/Lessons";
import {LevelInfo} from "@/models/LevelInfo";

export const setLevelInfoMutation = (state: State, levelInfo: LevelInfo) => {
    state.levelInfo = levelInfo
}
